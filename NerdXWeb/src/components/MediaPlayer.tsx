import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Video,
  Headphones,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './MediaPlayer.css';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface VideoPlayerProps {
  src: string;
  title?: string;
  accentColor?: string;
  locked?: boolean;
  unlockPath?: string;
}

function isEmbedUrl(url: string): boolean {
  return /youtube\.com\/embed|youtu\.be|vimeo\.com|dailymotion\.com/i.test(url);
}

export function VideoPlayer({ src, title, accentColor = '#7C4DFF', locked, unlockPath = '/app/credits' }: VideoPlayerProps) {
  const embedMode = isEmbedUrl(src);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

  const skip = useCallback((delta: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + delta));
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = pct * v.duration;
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const changeSpeed = useCallback((rate: number) => {
    const v = videoRef.current;
    if (v) v.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setMuted(val === 0);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTimeUpdate = () => {
      setCurrentTime(v.currentTime);
      if (v.buffered.length > 0) {
        setBuffered(v.buffered.end(v.buffered.length - 1));
      }
    };
    const onLoadedMetadata = () => { setDuration(v.duration); setLoading(false); };
    const onPlay = () => setPlaying(true);
    const onPause = () => { setPlaying(false); setShowControls(true); };
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onEnded = () => { setPlaying(false); setShowControls(true); };

    v.addEventListener('timeupdate', onTimeUpdate);
    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('waiting', onWaiting);
    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('ended', onEnded);

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('waiting', onWaiting);
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('ended', onEnded);
    };
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0;

  if (locked) {
    return (
      <div className="nerdx-media-card nerdx-video-card">
        <div className="nerdx-media-card-header">
          <Video size={18} style={{ color: accentColor }} />
          <span>Video Lesson</span>
        </div>
        <div className="nerdx-locked-media video-locked">
          <div className="nerdx-locked-content">
            <div className="nerdx-locked-icon-ring" style={{ borderColor: accentColor }}>
              <Lock size={28} style={{ color: accentColor }} />
            </div>
            <h3>Premium Video</h3>
            <p>Purchase credits to unlock this video lesson</p>
            <Link to={unlockPath} className="nerdx-unlock-btn" style={{ background: accentColor }}>
              Unlock Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (embedMode) {
    return (
      <div className="nerdx-media-card nerdx-video-card">
        <div className="nerdx-media-card-header">
          <Video size={18} style={{ color: accentColor }} />
          <span>{title || 'Video Lesson'}</span>
        </div>
        <div className="nerdx-embed-container">
          <iframe
            src={src}
            title={title || 'Video Lesson'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="nerdx-embed-iframe"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="nerdx-media-card nerdx-video-card">
      <div className="nerdx-media-card-header">
        <Video size={18} style={{ color: accentColor }} />
        <span>{title || 'Video Lesson'}</span>
      </div>
      <div
        ref={containerRef}
        className={`nerdx-video-container ${isFullscreen ? 'fullscreen' : ''}`}
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => { if (playing) setShowControls(false); }}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('.nerdx-video-controls')) return;
          togglePlay();
        }}
      >
        <video ref={videoRef} src={src} preload="metadata" className="nerdx-video-element" />

        {loading && (
          <div className="nerdx-video-loader">
            <div className="nerdx-spinner" style={{ borderTopColor: accentColor }} />
          </div>
        )}

        {!playing && !loading && (
          <button className="nerdx-play-overlay" onClick={togglePlay}>
            <div className="nerdx-play-circle" style={{ background: accentColor }}>
              <Play size={32} fill="white" />
            </div>
          </button>
        )}

        <div className={`nerdx-video-controls ${showControls || !playing ? 'visible' : ''}`}>
          <div className="nerdx-progress-bar" ref={progressRef} onClick={handleProgressClick}>
            <div className="nerdx-progress-buffered" style={{ width: `${bufferedPct}%` }} />
            <div className="nerdx-progress-filled" style={{ width: `${progress}%`, background: accentColor }} />
            <div className="nerdx-progress-thumb" style={{ left: `${progress}%`, background: accentColor }} />
          </div>

          <div className="nerdx-controls-row">
            <div className="nerdx-controls-left">
              <button className="nerdx-ctrl-btn" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
                {playing ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button className="nerdx-ctrl-btn" onClick={(e) => { e.stopPropagation(); skip(-10); }}>
                <SkipBack size={18} />
              </button>
              <button className="nerdx-ctrl-btn" onClick={(e) => { e.stopPropagation(); skip(10); }}>
                <SkipForward size={18} />
              </button>
              <span className="nerdx-time-display">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="nerdx-controls-right">
              <div className="nerdx-volume-group">
                <button className="nerdx-ctrl-btn" onClick={(e) => { e.stopPropagation(); toggleMute(); }}>
                  {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="nerdx-volume-slider"
                  onClick={(e) => e.stopPropagation()}
                  style={{ accentColor }}
                />
              </div>

              <div className="nerdx-speed-control" onClick={(e) => e.stopPropagation()}>
                <button className="nerdx-ctrl-btn nerdx-speed-btn" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                  <Settings size={16} />
                  <span>{playbackRate}x</span>
                </button>
                {showSpeedMenu && (
                  <div className="nerdx-speed-menu">
                    {speeds.map((s) => (
                      <button
                        key={s}
                        className={`nerdx-speed-option ${playbackRate === s ? 'active' : ''}`}
                        style={playbackRate === s ? { color: accentColor } : undefined}
                        onClick={() => changeSpeed(s)}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="nerdx-ctrl-btn" onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}>
                {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


interface AudioPlayerProps {
  src: string;
  title?: string;
  subject?: string;
  accentColor?: string;
  locked?: boolean;
  unlockPath?: string;
}

export function AudioPlayer({ src, title, subject, accentColor = '#7C4DFF', locked, unlockPath = '/app/credits' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loading, setLoading] = useState(true);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play(); setPlaying(true); }
    else { a.pause(); setPlaying(false); }
  }, []);

  const skip = useCallback((delta: number) => {
    const a = audioRef.current;
    if (a) a.currentTime = Math.max(0, Math.min(a.duration, a.currentTime + delta));
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    const bar = progressRef.current;
    if (!a || !bar) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    a.currentTime = pct * a.duration;
  }, []);

  const toggleMute = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
    setMuted(val === 0);
  }, []);

  const cycleSpeed = useCallback(() => {
    const speeds = [1, 1.25, 1.5, 2, 0.75];
    const idx = speeds.indexOf(playbackRate);
    const next = speeds[(idx + 1) % speeds.length];
    if (audioRef.current) audioRef.current.playbackRate = next;
    setPlaybackRate(next);
  }, [playbackRate]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTimeUpdate = () => setCurrentTime(a.currentTime);
    const onLoadedMetadata = () => { setDuration(a.duration); setLoading(false); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onEnded = () => setPlaying(false);

    a.addEventListener('timeupdate', onTimeUpdate);
    a.addEventListener('loadedmetadata', onLoadedMetadata);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('waiting', onWaiting);
    a.addEventListener('canplay', onCanPlay);
    a.addEventListener('ended', onEnded);

    return () => {
      a.removeEventListener('timeupdate', onTimeUpdate);
      a.removeEventListener('loadedmetadata', onLoadedMetadata);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('waiting', onWaiting);
      a.removeEventListener('canplay', onCanPlay);
      a.removeEventListener('ended', onEnded);
    };
  }, []);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (locked) {
    return (
      <div className="nerdx-media-card nerdx-audio-card">
        <div className="nerdx-media-card-header">
          <Headphones size={18} style={{ color: accentColor }} />
          <span>Audio Lesson</span>
        </div>
        <div className="nerdx-locked-media audio-locked">
          <div className="nerdx-locked-content">
            <div className="nerdx-locked-icon-ring" style={{ borderColor: accentColor }}>
              <Lock size={24} style={{ color: accentColor }} />
            </div>
            <h3>Premium Audio</h3>
            <p>Purchase credits to unlock</p>
            <Link to={unlockPath} className="nerdx-unlock-btn small" style={{ background: accentColor }}>
              Unlock
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nerdx-media-card nerdx-audio-card">
      <div className="nerdx-media-card-header">
        <Headphones size={18} style={{ color: accentColor }} />
        <span>{title || 'Audio Lesson'}</span>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="nerdx-audio-body">
        <div className="nerdx-audio-artwork" style={{ background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)` }}>
          <div className={`nerdx-audio-disc ${playing ? 'spinning' : ''}`} style={{ borderColor: `${accentColor}66` }}>
            <Headphones size={24} style={{ color: accentColor }} />
          </div>
          {subject && <span className="nerdx-audio-subject">{subject}</span>}
        </div>

        <div className="nerdx-audio-controls-area">
          <div className="nerdx-audio-progress-row">
            <span className="nerdx-audio-time">{formatTime(currentTime)}</span>
            <div className="nerdx-audio-progress-bar" ref={progressRef} onClick={handleProgressClick}>
              <div className="nerdx-audio-progress-filled" style={{ width: `${progress}%`, background: accentColor }} />
              <div className="nerdx-audio-progress-thumb" style={{ left: `${progress}%`, background: accentColor }} />
            </div>
            <span className="nerdx-audio-time">{formatTime(duration)}</span>
          </div>

          <div className="nerdx-audio-buttons">
            <button className="nerdx-audio-btn speed-btn" onClick={cycleSpeed}>
              {playbackRate}x
            </button>
            <button className="nerdx-audio-btn" onClick={() => skip(-15)}>
              <SkipBack size={20} />
            </button>
            <button
              className={`nerdx-audio-btn play-btn ${playing ? 'playing' : ''}`}
              style={{ background: accentColor }}
              onClick={togglePlay}
            >
              {loading ? (
                <div className="nerdx-spinner small" style={{ borderTopColor: '#fff' }} />
              ) : playing ? (
                <Pause size={24} fill="white" />
              ) : (
                <Play size={24} fill="white" />
              )}
            </button>
            <button className="nerdx-audio-btn" onClick={() => skip(15)}>
              <SkipForward size={20} />
            </button>
            <div className="nerdx-audio-volume">
              <button className="nerdx-audio-btn" onClick={toggleMute}>
                {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="nerdx-volume-slider compact"
                style={{ accentColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
