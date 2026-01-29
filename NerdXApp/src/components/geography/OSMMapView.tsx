/**
 * WebView-based OpenStreetMap (Leaflet) component for Geography Maps Lab.
 * Sends map_actions (markers, measurements, place_selected) to RN via postMessage.
 */

import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { getOSMMapHTML, OSMMapHTMLConfig } from './osmMapHTML';

export interface MapMarker {
  name: string;
  lat: number;
  lon: number;
  student_label?: string;
}

export interface MapMeasurement {
  distance_km: number;
  bearing_deg?: number;
  points: { lat: number; lon: number }[];
  markers: MapMarker[];
}

export interface MapActionPayload {
  type: 'marker_added' | 'measurement' | 'place_selected' | 'markers_cleared';
  marker?: MapMarker;
  markers?: MapMarker[];
  distance_km?: number;
  bearing_deg?: number;
  points?: { lat: number; lon: number }[];
  name?: string;
  lat?: number;
  lon?: number;
}

export interface OSMMapViewProps {
  config?: Partial<OSMMapHTMLConfig>;
  onMapAction?: (payload: MapActionPayload) => void;
  style?: object;
}

export interface OSMMapViewRef {
  clearMarkers: () => void;
}

const OSMMapView = React.forwardRef<OSMMapViewRef, OSMMapViewProps>(
  ({ config, onMapAction, style }, ref) => {
  const webRef = useRef<WebView>(null);

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const payload = JSON.parse(event.nativeEvent.data) as MapActionPayload;
        onMapAction?.(payload);
      } catch (_) {
        // ignore parse errors
      }
    },
    [onMapAction]
  );

  const clearMarkers = useCallback(() => {
    webRef.current?.injectJavaScript('window.clearMapMarkers && window.clearMapMarkers(); true;');
  }, []);

  React.useImperativeHandle(ref, () => ({ clearMarkers }), [clearMarkers]);

  const html = getOSMMapHTML(config);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleMessage}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#1976D2" />
          </View>
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 200,
  },
  webview: {
    flex: 1,
    backgroundColor: '#e4e4e4',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
  },
});

export default OSMMapView;
