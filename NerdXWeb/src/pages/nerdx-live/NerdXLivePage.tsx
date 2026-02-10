import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Copy,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  RefreshCw,
  Share2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../services/api/config';

type ConnectionState = 'idle' | 'connecting' | 'ready' | 'recording' | 'processing' | 'error';

type Caption = {
  id: string;
  speaker: 'user' | 'nerdx' | 'system';
  text: string;
};

const SESSION_HANDLE_KEY = 'nerdx_live_session_handle_v1';

function getRtcBaseUrl(): string {
  const explicit = (import.meta.env.VITE_NERDX_LIVE_RTC_URL as string | undefined) || '';
  if (explicit.trim()) return explicit.trim().replace(/\/+$/, '');

  const wsExplicit = (import.meta.env.VITE_NERDX_LIVE_WS_URL as string | undefined) || '';
  if (wsExplicit.trim()) {
    const trimmed = wsExplicit.trim().replace(/\/+$/, '');
    try {
      const u = new URL(trimmed);
      if (u.protocol === 'wss:') u.protocol = 'https:';
      if (u.protocol === 'ws:') u.protocol = 'http:';
      u.pathname = '';
      u.search = '';
      u.hash = '';
      return u.toString().replace(/\/+$/, '');
    } catch {
      return trimmed.replace(/^wss:/, 'https:').replace(/^ws:/, 'http:');
    }
  }

  try {
    const u = new URL(API_BASE_URL);
    u.pathname = '';
    u.search = '';
    u.hash = '';
    return u.toString().replace(/\/+$/, '');
  } catch {
    return '';
  }
}

function getIceServers(): RTCIceServer[] {
  const raw = (import.meta.env.VITE_NERDX_LIVE_ICE_SERVERS as string | undefined) || '';
  if (raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as RTCIceServer[];
    } catch {
      // ignore
    }
  }
  return [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];
}

async function waitForIceGatheringComplete(pc: RTCPeerConnection, timeoutMs: number = 2500): Promise<void> {
  if (pc.iceGatheringState === 'complete') return;
  await new Promise<void>((resolve) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      pc.removeEventListener('icegatheringstatechange', check);
      window.clearTimeout(timer);
      resolve();
    };
    const check = () => {
      if (pc.iceGatheringState === 'complete') finish();
    };
    const timer = window.setTimeout(() => finish(), timeoutMs);
    pc.addEventListener('icegatheringstatechange', check);
    check();
  });
}

function pickRecordingMimeType(): string | null {
  if (typeof MediaRecorder === 'undefined') return null;
  const candidates = [
    'audio/mp4', // Safari
    'audio/webm;codecs=opus', // Chrome/Edge
    'audio/webm',
    'audio/ogg;codecs=opus', // Firefox
    'audio/ogg',
  ];
  for (const c of candidates) {
    try {
      if ((MediaRecorder as any).isTypeSupported?.(c)) return c;
    } catch {
      // ignore
    }
  }
  return null;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const res = reader.result as string;
      const base64 = res.includes(',') ? res.split(',')[1] : res;
      resolve(base64 || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function NerdXLivePage() {
  const { user } = useAuth();

  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<BlobPart[]>([]);
  const stopTimerRef = useRef<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const audioPlayingRef = useRef(false);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const mutedRef = useRef(false);

  const sessionHandleRef = useRef<string | null>(null);
  const resumeRequestedRef = useRef(false);

  const rtcBase = useMemo(() => getRtcBaseUrl(), []);
  const iceServers = useMemo(() => getIceServers(), []);

  useEffect(() => {
    try {
      sessionHandleRef.current = localStorage.getItem(SESSION_HANDLE_KEY);
    } catch {
      sessionHandleRef.current = null;
    }
  }, []);

  const addCaption = (speaker: Caption['speaker'], text: string) => {
    const trimmed = (text || '').trim();
    if (!trimmed) return;
    setCaptions((prev) => [...prev, { id: `${Date.now()}_${Math.random().toString(16).slice(2)}`, speaker, text: trimmed }]);
  };

  const copyToClipboard = async (text: string) => {
    const value = (text || '').trim();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      addCaption('system', 'Copied to clipboard.');
    } catch {
      addCaption('system', value);
    }
  };

  const ensureAudioContext = async () => {
    if (audioCtxRef.current) return audioCtxRef.current;
    const Ctx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext | undefined;
    if (!Ctx) return null;
    const ctx = new Ctx();
    audioCtxRef.current = ctx;
    try {
      if (ctx.state !== 'running') await ctx.resume();
    } catch {
      // ignore
    }
    return ctx;
  };

  const stopPlayback = () => {
    audioQueueRef.current = [];
    audioPlayingRef.current = false;
    try {
      audioSourceRef.current?.stop();
    } catch {
      // ignore
    }
    audioSourceRef.current = null;
  };

  const playNext = async () => {
    if (audioPlayingRef.current) return;
    if (audioQueueRef.current.length === 0) return;

    const next = audioQueueRef.current.shift();
    if (!next) return;

    const ctx = await ensureAudioContext();
    if (!ctx) return;

    audioPlayingRef.current = true;
    try {
      const buf = base64ToArrayBuffer(next);
      const decoded = await ctx.decodeAudioData(buf.slice(0));
      const source = ctx.createBufferSource();
      source.buffer = decoded;

      if (mutedRef.current) {
        const gain = ctx.createGain();
        gain.gain.value = 0;
        source.connect(gain).connect(ctx.destination);
      } else {
        source.connect(ctx.destination);
      }

      audioSourceRef.current = source;
      source.onended = () => {
        audioSourceRef.current = null;
        audioPlayingRef.current = false;
        void playNext();
      };
      source.start(0);
    } catch (e) {
      audioPlayingRef.current = false;
      void playNext();
    }
  };

  const handleServerMessage = (raw: unknown) => {
    let text = raw;
    if (raw instanceof ArrayBuffer) {
      try {
        text = new TextDecoder().decode(raw);
      } catch {
        return;
      }
    }
    if (typeof text !== 'string' || !text) return;

    try {
      const data = JSON.parse(text);
      switch (data.type) {
        case 'ready':
          setConnectionState('ready');
          setError(null);
          addCaption('system', data.message || 'Connected to NerdX Live.');
          break;
        case 'audio':
          if (recorderRef.current) return; // barge-in: ignore while recording
          if (typeof data.data === 'string' && data.data.length) {
            audioQueueRef.current.push(data.data);
            setConnectionState((cur) => (cur === 'recording' ? cur : 'processing'));
            void playNext();
          }
          break;
        case 'text':
          if (typeof data.text === 'string' && data.text.trim()) {
            const speaker = data.speaker === 'nerdx' ? 'nerdx' : data.speaker === 'user' ? 'user' : 'system';
            addCaption(speaker, data.text);
          }
          break;
        case 'turnComplete':
          setConnectionState((cur) => (cur === 'recording' ? cur : 'ready'));
          break;
        case 'interrupted':
          stopPlayback();
          break;
        case 'sessionUpdate':
          if (typeof data.handle === 'string' && data.handle.trim()) {
            const handle = data.handle.trim();
            sessionHandleRef.current = handle;
            try {
              localStorage.setItem(SESSION_HANDLE_KEY, handle);
            } catch {
              // ignore
            }
          }
          break;
        case 'goAway':
          if (typeof data.handle === 'string' && data.handle.trim()) {
            const handle = data.handle.trim();
            sessionHandleRef.current = handle;
            try {
              localStorage.setItem(SESSION_HANDLE_KEY, handle);
            } catch {
              // ignore
            }
          }
          resumeRequestedRef.current = true;
          try {
            dcRef.current?.close();
          } catch {
            // ignore
          }
          try {
            pcRef.current?.close();
          } catch {
            // ignore
          }
          break;
        case 'error':
          setError(data.message || 'NerdX Live error');
          setConnectionState('error');
          addCaption('system', data.message || 'Session error.');
          break;
        default:
          break;
      }
    } catch {
      // ignore
    }
  };

  const connect = async () => {
    if (connectionState === 'connecting' || connectionState === 'recording') return;
    if (pcRef.current || dcRef.current) {
      disconnect();
    }
    setConnectionState('connecting');
    setError(null);
    stopPlayback();
    setCaptions([]);

    if (!rtcBase) {
      setConnectionState('error');
      setError('NerdX Live server URL is not configured.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    } catch (e) {
      setConnectionState('error');
      setError('Microphone permission is required.');
      return;
    }

    try {
      if (typeof RTCPeerConnection === 'undefined') {
        setConnectionState('error');
        setError('WebRTC is not supported in this browser.');
        return;
      }

      const pc = new RTCPeerConnection({ iceServers });
      pcRef.current = pc;

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        if (state === 'failed' || state === 'disconnected' || state === 'closed') {
          dcRef.current = null;
          pcRef.current = null;

          if (resumeRequestedRef.current) {
            resumeRequestedRef.current = false;
            void connect();
            return;
          }
          setConnectionState('idle');
        }
      };

      const dc = pc.createDataChannel('nerdx');
      dcRef.current = dc;
      dc.onmessage = (event) => handleServerMessage(event.data);
      dc.onerror = () => {
        setConnectionState('error');
        setError('NerdX Live data channel error.');
      };
      dc.onclose = () => {
        dcRef.current = null;
      };

      const offerDesc = await pc.createOffer();
      await pc.setLocalDescription(offerDesc);
      await waitForIceGatheringComplete(pc);
      const local = pc.localDescription;
      if (!local?.sdp || !local.type) throw new Error('Failed to create WebRTC offer.');

      const uid = user?.id || 'guest_voice';
      const response = await fetch(`${rtcBase}/rtc/nerdx-live/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sdp: local.sdp,
          type: local.type,
          user_id: uid,
          ...(sessionHandleRef.current ? { session_handle: sessionHandleRef.current } : {}),
        }),
      });

      if (!response.ok) {
        let msg = '';
        try {
          const body = (await response.json()) as { detail?: string; message?: string } | null;
          msg = body?.detail || body?.message || '';
        } catch {
          msg = await response.text().catch(() => '');
        }
        throw new Error(msg || `WebRTC offer failed (${response.status})`);
      }

      const answer = (await response.json()) as { sdp?: string; type?: RTCSdpType };
      if (!answer?.sdp || !answer?.type) throw new Error('Invalid WebRTC answer from server.');

      await pc.setRemoteDescription(answer as RTCSessionDescriptionInit);
    }
    catch (e: any) {
      setConnectionState('error');
      setError(e?.message || 'Could not connect to NerdX Live.');
      try {
        dcRef.current?.close();
      } catch {
        // ignore
      }
      try {
        pcRef.current?.close();
      } catch {
        // ignore
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      dcRef.current = null;
      pcRef.current = null;
    }
  };

  const disconnect = () => {
    resumeRequestedRef.current = false;
    stopPlayback();
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
    if (recorderRef.current) {
      try {
        recorderRef.current.stop();
      } catch {
        // ignore
      }
      recorderRef.current = null;
    }
    if (dcRef.current) {
      try {
        dcRef.current.send(JSON.stringify({ type: 'end' }));
      } catch {
        // ignore
      }
      try {
        dcRef.current.close();
      } catch {
        // ignore
      }
      dcRef.current = null;
    }
    if (pcRef.current) {
      try {
        pcRef.current.close();
      } catch {
        // ignore
      }
      pcRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setConnectionState('idle');
  };

  const stopAndSend = async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    try {
      recorder.stop();
    } catch {
      // ignore
    }
  };

  const startRecording = async () => {
    if (!dcRef.current || dcRef.current.readyState !== 'open') return;
    if (!streamRef.current) {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        setError('Microphone permission is required.');
        return;
      }
    }
    if (recorderRef.current) return;

    stopPlayback();
    try {
      dcRef.current.send(JSON.stringify({ type: 'interrupt' }));
    } catch {
      // ignore
    }

    const mimeType = pickRecordingMimeType();
    try {
      const rec = mimeType
        ? new MediaRecorder(streamRef.current, { mimeType })
        : new MediaRecorder(streamRef.current);

      recordingChunksRef.current = [];
      rec.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) recordingChunksRef.current.push(ev.data);
      };
      rec.onstop = async () => {
        const chunks = recordingChunksRef.current;
        recordingChunksRef.current = [];
        recorderRef.current = null;
        if (stopTimerRef.current) {
          window.clearTimeout(stopTimerRef.current);
          stopTimerRef.current = null;
        }

        const blob = new Blob(chunks, { type: rec.mimeType || mimeType || '' });
        if (blob.size === 0) {
          setConnectionState('ready');
          return;
        }

        setConnectionState('processing');
        addCaption('user', '(Speaking...)');
        try {
          const b64 = await blobToBase64(blob);
          if (!b64) {
            setConnectionState('ready');
            return;
          }
          if (dcRef.current?.readyState === 'open') {
            dcRef.current.send(
              JSON.stringify({
                type: 'audio',
                data: b64,
                mimeType: blob.type || mimeType || undefined,
              })
            );
          }
        } catch {
          setError('Failed to send audio.');
        }
      };

      recorderRef.current = rec;
      setConnectionState('recording');
      rec.start(250); // collect chunks for browser stability; server receives one blob on stop

      stopTimerRef.current = window.setTimeout(() => void stopAndSend(), 45000);
    } catch {
      setError('Recording is not supported in this browser.');
      setConnectionState('ready');
    }
  };

  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    if (next) stopPlayback();
  };

  const statusLabel = useMemo(() => {
    switch (connectionState) {
      case 'idle':
        return 'Disconnected';
      case 'connecting':
        return 'Connecting...';
      case 'ready':
        return 'Ready';
      case 'recording':
        return 'Recording...';
      case 'processing':
        return 'Thinking...';
      case 'error':
        return 'Error';
      default:
        return 'Disconnected';
    }
  }, [connectionState]);

  const canRecord = connectionState === 'ready' || connectionState === 'processing';
  const isConnected = connectionState === 'ready' || connectionState === 'recording' || connectionState === 'processing';

  return (
    <div className="teacher-mode-page teacher-chat-gpt-layout nerdx-live-page">
      <aside className="teacher-chat-sidebar">
        <Link to="/app" className="teacher-chat-sidebar-item" aria-label="Back">
          <ArrowLeft size={20} />
        </Link>
        <button
          type="button"
          className="teacher-chat-sidebar-item"
          onClick={() => void connect()}
          aria-label="Reconnect"
          title="Reconnect"
          disabled={connectionState === 'connecting' || connectionState === 'recording'}
        >
          <RefreshCw size={20} />
        </button>
        <button
          type="button"
          className="teacher-chat-sidebar-item"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
          title={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <div className="teacher-chat-sidebar-spacer" />
        <div className="teacher-chat-sidebar-user" title={`${user?.credits ?? 0} credits`}>
          <span className="teacher-chat-sidebar-credits">{user?.credits ?? 0}</span>
          <span className="teacher-chat-sidebar-credits-label">credits</span>
        </div>
      </aside>

      <div className="teacher-chat-main">
        <header className="teacher-chat-topbar">
          <div className="teacher-chat-topbar-title">
            <span className="teacher-chat-topbar-icon" aria-hidden="true">
              <Mic size={20} />
            </span>
            <span>NerdX Live</span>
            <span className="teacher-chat-topbar-sub">{statusLabel}</span>
          </div>
          <div className="teacher-chat-topbar-actions">
            <button
              type="button"
              className="teacher-chat-topbar-btn"
              onClick={() => {
                const shareText = 'Try NerdX Live voice tutoring.';
                if (navigator.share) {
                  navigator.share({ title: 'NerdX Live', text: shareText }).catch(() => void copyToClipboard(shareText));
                } else {
                  void copyToClipboard(shareText);
                }
              }}
              title="Share"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
            <button
              type="button"
              className="teacher-chat-topbar-btn teacher-chat-topbar-btn-icon"
              onClick={() => void copyToClipboard(rtcBase ? `${rtcBase}/rtc/nerdx-live/offer` : '')}
              aria-label="Copy"
              title="Copy"
            >
              <Copy size={18} />
            </button>
          </div>
        </header>

        <div className="teacher-mode-chat">
          <div className="teacher-messages nerdx-live-captions">
            {captions.length === 0 ? (
              <div className="teacher-msg-row teacher-msg-row-assistant">
                <div className="teacher-msg-bubble teacher-msg-bubble-assistant">
                  <div className="teacher-msg-assistant-content">
                    <p style={{ margin: 0 }}>
                      Tap <strong>Connect</strong>, then press the mic to speak. NerdX will reply with voice.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              captions.map((c) => (
                <div key={c.id} className={`teacher-msg-row ${c.speaker === 'user' ? 'teacher-msg-row-user' : 'teacher-msg-row-assistant'}`}>
                  <div className={`teacher-msg-bubble ${c.speaker === 'user' ? 'teacher-msg-bubble-user' : 'teacher-msg-bubble-assistant'}`}>
                    <span>{c.text}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {error && <div className="teacher-chat-error">{error}</div>}

          <div className="teacher-chat-input-wrap">
            <div className="teacher-chat-input-bar nerdx-live-controls">
              {!isConnected ? (
                <button type="button" className="teacher-chat-topbar-btn" onClick={() => void connect()} disabled={connectionState === 'connecting'}>
                  <Phone size={18} /> <span>Connect</span>
                </button>
              ) : (
                <button type="button" className="teacher-chat-topbar-btn" onClick={disconnect}>
                  <PhoneOff size={18} /> <span>Disconnect</span>
                </button>
              )}

              {connectionState === 'recording' ? (
                <button type="button" className="teacher-chat-topbar-btn" onClick={() => void stopAndSend()}>
                  <MicOff size={18} /> <span>Send</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="teacher-chat-topbar-btn"
                  onClick={() => void startRecording()}
                  disabled={!canRecord}
                  title={!isConnected ? 'Connect first' : undefined}
                >
                  <Mic size={18} /> <span>Talk</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
