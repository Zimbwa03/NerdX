import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useThemedColors } from '../../../theme/useThemedStyles';

export interface WebDesignPreviewProps {
    htmlContent: string;
}

// Renders the student's HTML in a sandboxed WebView.
const WebDesignPreview: React.FC<WebDesignPreviewProps> = ({ htmlContent }) => {
    const colors = useThemedColors();

    // Ensure there is a full HTML document; if the student only writes body
    // content, wrap it for them.
    const isFullDocument = /<html[\s\S]*<\/html>/i.test(htmlContent);
    const wrappedHtml = isFullDocument
        ? htmlContent
        : `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Web Design Preview</title>
</head>
<body>
${htmlContent}
</body>
</html>`;

    return (
        <View style={[styles.container, { backgroundColor: colors.background.paper }]}>
            <WebView
                originWhitelist={['*']}
                source={{ html: wrappedHtml }}
                style={styles.webview}
                javaScriptEnabled={false}
                domStorageEnabled={false}
                setSupportMultipleWindows={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderLeftWidth: 1,
    },
    webview: {
        flex: 1,
    },
});

export default WebDesignPreview;

