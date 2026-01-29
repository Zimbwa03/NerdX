/**
 * Inline HTML for Leaflet + OpenStreetMap in WebView.
 * Used by OSMMapView for the Geography Maps Lab (ZIMSEC).
 *
 * Tile usage: OSM tile servers are not for heavy production traffic.
 * For scale, use a tile provider or host your own tiles.
 * @see https://operations.osmfoundation.org/policies/tiles/
 */

const LEAFLET_CSS =
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS =
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
const OSM_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export interface OSMMapHTMLConfig {
  centerLat: number;
  centerLon: number;
  zoom: number;
}

const defaultConfig: OSMMapHTMLConfig = {
  centerLat: -19.0154,
  centerLon: 29.1549,
  zoom: 6,
};

export function getOSMMapHTML(config: Partial<OSMMapHTMLConfig> = {}): string {
  const { centerLat, centerLon, zoom } = { ...defaultConfig, ...config };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="${LEAFLET_CSS}" crossorigin="" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; font-family: system-ui, sans-serif; }
    #map { width: 100%; height: 100%; }
    .leaflet-popup-content-wrapper { border-radius: 8px; }
    .leaflet-popup-content { margin: 10px 14px; }
    .distance-label { font-weight: bold; color: #1976D2; }
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
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(msg));
        }
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
        var pts = markers.map(function(m) { return [m.lat, m.lon]; });
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
        marker._idx = markers.length;
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

      map.on('locationfound', function(e) {
        send({ type: 'place_selected', name: 'Current location', lat: e.latlng.lat, lon: e.latlng.lng });
      });

      window.clearMapMarkers = function() {
        markerLayer.clearLayers();
        if (polyline) { map.removeLayer(polyline); polyline = null; }
        markers = [];
        send({ type: 'markers_cleared', markers: [] });
      };

      window.getMapState = function() {
        return {
          center: map.getCenter(),
          zoom: map.getZoom(),
          markers: markers.map(function(m) { return { name: m.name, lat: m.lat, lon: m.lon, student_label: m.label }; })
        };
      };
    })();
  </script>
</body>
</html>`;
}
