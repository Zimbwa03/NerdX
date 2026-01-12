/**
 * MathRenderer Component
 * Renders LaTeX math expressions using KaTeX via WebView
 * Provides professional math formatting for equations, formulas, and expressions
 */
import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';

interface MathRendererProps {
    content: string;
    fontSize?: number;
    style?: object;
}

/**
 * MathRenderer Component
 * Uses KaTeX CDN for rendering LaTeX math expressions in a WebView
 * Supports both inline ($...$) and display ($$...$$) math
 */
const MathRenderer: React.FC<MathRendererProps> = ({
    content,
    fontSize = 16,
    style
}) => {
    const { isDarkMode } = useTheme();

    const textColor = isDarkMode ? '#E0E0E0' : '#1A1A1A';
    const bgColor = isDarkMode ? 'transparent' : 'transparent';

    // Generate HTML with KaTeX
    const htmlContent = useMemo(() => {
        // Process content to handle math delimiters
        let processedContent = content || '';

        // Escape HTML special characters (but preserve math delimiters)
        processedContent = processedContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Convert markdown-style formatting
        processedContent = processedContent
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br/>');

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: ${fontSize}px;
            line-height: 1.6;
            color: ${textColor};
            background: ${bgColor};
            padding: 8px 4px;
            word-wrap: break-word;
        }
        .katex {
            font-size: 1.1em !important;
        }
        .katex-display {
            margin: 12px 0 !important;
            text-align: center;
        }
        .katex-display > .katex {
            font-size: 1.2em !important;
        }
        strong {
            font-weight: 700;
            color: ${isDarkMode ? '#00E5FF' : '#6200EE'};
        }
        em {
            font-style: italic;
        }
        code {
            background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }
        ul, ol {
            padding-left: 20px;
            margin: 8px 0;
        }
        li {
            margin-bottom: 4px;
        }
    </style>
</head>
<body>
    <div id="content">${processedContent}</div>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            renderMathInElement(document.getElementById("content"), {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false},
                    {left: "\\\\[", right: "\\\\]", display: true},
                    {left: "\\\\(", right: "\\\\)", display: false}
                ],
                throwOnError: false,
                output: "html"
            });
            
            // Send height to React Native after rendering
            setTimeout(function() {
                const height = document.body.scrollHeight;
                window.ReactNativeWebView.postMessage(JSON.stringify({ height: height }));
            }, 100);
        });
    </script>
</body>
</html>
        `;
    }, [content, fontSize, textColor, bgColor, isDarkMode]);

    const [webViewHeight, setWebViewHeight] = React.useState(100);

    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.height) {
                setWebViewHeight(data.height + 20);
            }
        } catch (e) {
            // Ignore parse errors
        }
    };

    return (
        <View style={[styles.container, { height: webViewHeight }, style]}>
            <WebView
                source={{ html: htmlContent }}
                style={styles.webview}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onMessage={handleMessage}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mixedContentMode="compatibility"
                allowFileAccess={true}
                scalesPageToFit={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
    },
    webview: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

export default MathRenderer;
