import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe, Loader2, Sparkles, Trash2 } from 'lucide-react';
import type { SimulationMetadata } from '../../../data/virtualLab';
import { useAuth } from '../../../context/AuthContext';
import { MathRenderer } from '../../../components/MathRenderer';
import { KnowledgeCheckModal } from '../../../components/virtualLab/KnowledgeCheckModal';
import { virtualLabApi } from '../../../services/api/virtualLabApi';

type OLevel = 'O' | 'A';

interface MapMarker {
  name: string;
  lat: number;
  lon: number;
  student_label?: string;
}

interface MapActionPayload {
  type: 'marker_added' | 'measurement' | 'place_selected' | 'markers_cleared';
  markers?: MapMarker[];
  distance_km?: number;
  bearing_deg?: number;
  points?: Array<{ lat: number; lon: number }>;
  name?: string;
  lat?: number;
  lon?: number;
}

function getGeoMapsHTML(): string {
  const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  // Zimbabwe-ish default for NerdX learners.
  const centerLat = -19.0154;
  const centerLon = 29.1549;
  const zoom = 6;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="${LEAFLET_CSS}" crossorigin="" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; font-family: system-ui, sans-serif; background: #e4e4e4; }
    #map { width: 100%; height: 100%; }
    .leaflet-popup-content-wrapper { border-radius: 8px; }
    .leaflet-popup-content { margin: 10px 14px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="${LEAFLET_JS}" crossorigin=""></script>
  <script>
    (function() {
      var map = L.map('map', { zoomControl: true }).setView([${centerLat}, ${centerLon}], ${zoom});
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '${OSM_ATTR}',
        maxZoom: 19
      }).addTo(map);

      var markers = [];
      var polyline = null;
      var markerLayer = L.layerGroup().addTo(map);

      function send(msg) {
        try { window.parent && window.parent.postMessage(JSON.stringify(msg), '*'); } catch (e) {}
      }

      function haversineKm(lat1, lon1, lat2, lon2) {
        var R = 6371;
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2)*Math.sin(dLat/2) +
          Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      }

      function bearingDeg(lat1, lon1, lat2, lon2) {
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var y = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
        var x = Math.cos(lat1*Math.PI/180)*Math.sin(lat2*Math.PI/180) -
          Math.sin(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.cos(dLon);
        return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      }

      function updateLineAndMeasurement() {
        if (polyline) { map.removeLayer(polyline); polyline = null; }
        if (markers.length < 2) return;
        var pts = markers.slice(0, 2).map(function(m) { return [m.lat, m.lon]; });
        polyline = L.polyline(pts, { color: '#1976D2', weight: 3 }).addTo(map);
        var d = haversineKm(markers[0].lat, markers[0].lon, markers[1].lat, markers[1].lon);
        var b = bearingDeg(markers[0].lat, markers[0].lon, markers[1].lat, markers[1].lon);
        send({
          type: 'measurement',
          distance_km: Math.round(d * 100) / 100,
          bearing_deg: Math.round(b * 10) / 10,
          points: [{ lat: markers[0].lat, lon: markers[0].lon }, { lat: markers[1].lat, lon: markers[1].lon }],
          markers: markers.map(function(m) { return { name: m.name || '', lat: m.lat, lon: m.lon, student_label: m.label || '' }; })
        });
      }

      map.on('click', function(e) {
        var lat = e.latlng.lat;
        var lon = e.latlng.lng;
        var label = 'Point ' + (markers.length + 1);
        var marker = L.marker([lat, lon]).addTo(markerLayer);
        marker.bindPopup('<b>' + label + '</b><br/>' + lat.toFixed(5) + ', ' + lon.toFixed(5));
        marker.on('popupopen', function() {
          send({ type: 'place_selected', name: label, lat: lat, lon: lon });
        });

        markers.push({ lat: lat, lon: lon, name: label, label: label, layer: marker });
        send({
          type: 'marker_added',
          marker: { name: label, lat: lat, lon: lon, student_label: label },
          markers: markers.map(function(m) { return { name: m.name || '', lat: m.lat, lon: m.lon, student_label: m.label || '' }; })
        });

        updateLineAndMeasurement();
      });

      window.clearMapMarkers = function() {
        markerLayer.clearLayers();
        if (polyline) { map.removeLayer(polyline); polyline = null; }
        markers = [];
        send({ type: 'markers_cleared', markers: [] });
      };

      window.addEventListener('message', function(event) {
        var data = event.data;
        try { if (typeof data === 'string') data = JSON.parse(data); } catch (e) {}
        if (data && data.type === 'clear_markers') {
          window.clearMapMarkers && window.clearMapMarkers();
        }
      });
    })();
  </script>
</body>
</html>`;
}

export function GeoMapsLab({ simulation }: { simulation: SimulationMetadata }) {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [bearingDeg, setBearingDeg] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [lines, setLines] = useState<Array<{ points: Array<{ lat: number; lon: number }>; label?: string }>>([]);

  const [level, setLevel] = useState<OLevel>('O');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const html = useMemo(() => getGeoMapsHTML(), []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const iframeWindow = iframeRef.current?.contentWindow;
      if (iframeWindow && event.source !== iframeWindow) return;
      if (typeof event.data !== 'string') return;

      let payload: MapActionPayload | null = null;
      try {
        payload = JSON.parse(event.data) as MapActionPayload;
      } catch {
        return;
      }

      if (!payload || typeof payload.type !== 'string') return;

      if (payload.type === 'marker_added' && Array.isArray(payload.markers)) {
        setMarkers(payload.markers);
      }

      if (payload.type === 'measurement') {
        setDistanceKm(typeof payload.distance_km === 'number' ? payload.distance_km : null);
        setBearingDeg(typeof payload.bearing_deg === 'number' ? payload.bearing_deg : null);
        if (Array.isArray(payload.points) && payload.points.length >= 2) {
          setLines([{ points: payload.points, label: 'Measured line' }]);
        }
        if (Array.isArray(payload.markers)) setMarkers(payload.markers);
      }

      if (
        payload.type === 'place_selected' &&
        typeof payload.name === 'string' &&
        typeof payload.lat === 'number' &&
        typeof payload.lon === 'number'
      ) {
        setSelectedPlace({ name: payload.name, lat: payload.lat, lon: payload.lon });
      }

      if (payload.type === 'markers_cleared') {
        setMarkers([]);
        setDistanceKm(null);
        setBearingDeg(null);
        setSelectedPlace(null);
        setLines([]);
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const clearMarkers = () => {
    const win = iframeRef.current?.contentWindow;
    try {
      win?.postMessage(JSON.stringify({ type: 'clear_markers' }), '*');
      (win as unknown as { clearMapMarkers?: () => void })?.clearMapMarkers?.();
    } catch {
      // ignore
    }
    setMarkers([]);
    setDistanceKm(null);
    setBearingDeg(null);
    setSelectedPlace(null);
    setLines([]);
  };

  const canRequestFeedback = markers.length > 0 || distanceKm != null || bearingDeg != null || selectedPlace != null;
  const canTakeQuiz = markers.length >= 2;

  const getFeedback = async () => {
    setError(null);
    setLoading(true);
    setFeedback(null);

    try {
      const result = await virtualLabApi.getGeoMapsFeedback({
        level,
        topic: simulation.topic,
        task_type: 'Mapwork',
        map_actions: {
          markers: markers.map((m) => ({ name: m.name, lat: m.lat, lon: m.lon, student_label: m.student_label })),
          lines,
          measurements: {
            distance_km: distanceKm ?? undefined,
            bearing_deg: bearingDeg ?? undefined,
          },
          selected_place: selectedPlace ?? undefined,
        },
        student_answer_text: studentAnswer.trim() || undefined,
      });

      setFeedback(result.response);
      if (typeof result.credits_remaining === 'string') {
        const parsed = Number(result.credits_remaining);
        if (Number.isFinite(parsed)) updateUser({ credits: parsed });
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Failed to get AI feedback';
      setError(String(msg));

      if (e?.response?.status === 402) {
        const ok = window.confirm(`${msg}\n\nBuy credits to use the AI tutor?`);
        if (ok) navigate('/app/credits');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subject-page-v2 virtual-lab-sim-page">
      <header className="subject-header-v2">
        <Link to="/app/virtual-lab" className="back-btn-v2">
          <ArrowLeft size={20} />
          <span>Back</span>
        </Link>
        <div className="subject-header-content">
          <div className="subject-icon-v2" style={{ background: 'linear-gradient(135deg, #2E7D32, #1B5E20)' }}>
            <Globe size={28} />
          </div>
          <div>
            <h1>{simulation.title}</h1>
            <p>{simulation.topic}</p>
          </div>
        </div>
      </header>

      <div className="vl-editor-grid wide">
        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">Task</div>
            <div className="vl-card-subtitle">
              Click on the map to place markers. Place two markers to measure distance and bearing. Open a marker popup to select a place.
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">OpenStreetMap</div>
            <div className="vl-card-subtitle">Use the map to collect evidence for a settlement/transport/drainage answer.</div>

            <div style={{ marginTop: 12 }}>
              <iframe
                ref={iframeRef}
                title="Geo Maps Lab"
                srcDoc={html}
                className="vl-web-preview"
                style={{ height: 420 }}
              />
            </div>

            <div className="vl-editor-toolbar" style={{ marginTop: 12 }}>
              <button type="button" className="vl-btn secondary" onClick={clearMarkers}>
                <Trash2 size={16} /> Clear markers
              </button>
            </div>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Your Map Data</div>
            <div className="vl-card-subtitle">
              Markers: {markers.length}
              {distanceKm != null ? ` • Distance: ${distanceKm.toFixed(2)} km` : ''}
              {bearingDeg != null ? ` • Bearing: ${bearingDeg.toFixed(1)}°` : ''}
            </div>
            {selectedPlace ? (
              <div className="vl-card-subtitle" style={{ marginTop: 8 }}>
                Selected: {selectedPlace.name} ({selectedPlace.lat.toFixed(4)}, {selectedPlace.lon.toFixed(4)})
              </div>
            ) : null}
          </div>
        </div>

        <div className="vl-col">
          <div className="vl-card">
            <div className="vl-card-title">AI Feedback (DeepSeek)</div>
            <div className="vl-card-subtitle">Send your map actions and (optional) written answer for marking.</div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Level</div>
              <div className="vl-tab-row">
                <button type="button" className={`vl-tab ${level === 'O' ? 'active' : ''}`} onClick={() => setLevel('O')}>
                  O-Level
                </button>
                <button type="button" className={`vl-tab ${level === 'A' ? 'active' : ''}`} onClick={() => setLevel('A')}>
                  A-Level
                </button>
              </div>
            </div>

            <div className="vl-editor-row">
              <div className="vl-editor-label">Your Answer (optional)</div>
              <textarea
                className="vl-editor-textarea"
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="e.g. The settlement is nucleated because..."
                rows={4}
              />
            </div>

            <button
              type="button"
              className="vl-btn primary"
              onClick={() => void getFeedback()}
              disabled={!canRequestFeedback || loading}
            >
              {loading ? <Loader2 size={16} className="vl-spin" /> : <Sparkles size={16} />}
              {loading ? 'Getting feedback...' : 'Get AI feedback (1 credit)'}
            </button>

            {error ? <div className="vl-alert" style={{ marginTop: 12 }}>{error}</div> : null}

            {feedback ? (
              <div style={{ marginTop: 12 }}>
                <MathRenderer content={feedback} fontSize={15} />
              </div>
            ) : null}
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Knowledge Check</div>
            <div className="vl-card-subtitle">Place two markers to unlock.</div>
            <button type="button" className="vl-btn primary" onClick={() => setQuizOpen(true)} disabled={!canTakeQuiz}>
              <Sparkles size={16} /> {canTakeQuiz ? 'Start knowledge check' : 'Add two markers'}
            </button>
          </div>

          <div className="vl-card">
            <div className="vl-card-title">Learning Objectives</div>
            <ul className="vl-bullets">
              {simulation.learningObjectives.map((o) => (
                <li key={o.id}>{o.text}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <KnowledgeCheckModal open={quizOpen} simulation={simulation} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

