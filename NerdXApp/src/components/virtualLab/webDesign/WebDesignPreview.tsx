import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useThemedColors } from '../../../theme/useThemedStyles';

export interface WebDesignPreviewProps {
    htmlContent: string;
    cssContent?: string;
    jsContent?: string;
    enableJavaScript?: boolean;
}

// Renders the student's HTML in a sandboxed WebView.
const WebDesignPreview: React.FC<WebDesignPreviewProps> = ({ htmlContent, cssContent, jsContent, enableJavaScript }) => {
    const colors = useThemedColors();

    // Ensure there is a full HTML document; if the student only writes body
    // content, wrap it for them.
    const isFullDocument = /<html[\s\S]*<\/html>/i.test(htmlContent);

    const baseHtml = isFullDocument
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

    const insertBeforeClosingTag = (content: string, tag: string, snippet: string) => {
        const regex = new RegExp(`</${tag}>`, 'i');
        if (regex.test(content)) {
            return content.replace(regex, `${snippet}</${tag}>`);
        }
        return content + snippet;
    };

    const withCss = cssContent && cssContent.trim()
        ? insertBeforeClosingTag(baseHtml, 'head', `<style>${cssContent}</style>`)
        : baseHtml;
    const withJs = jsContent && jsContent.trim()
        ? insertBeforeClosingTag(withCss, 'body', `<script>${jsContent}</script>`)
        : withCss;
    const jsEnabled = enableJavaScript ?? Boolean(jsContent && jsContent.trim());

    return (
        <View style={[styles.container, { backgroundColor: colors.background.paper }]}>
            <WebView
                originWhitelist={['*']}
                source={{ html: withJs }}
                style={styles.webview}
                javaScriptEnabled={jsEnabled}
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

