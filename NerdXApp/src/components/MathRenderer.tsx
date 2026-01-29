/**
 * MathRenderer Component
 * Renders Markdown-ish text with LaTeX math using KaTeX (WebView).
 *
 * Why: The A-Level notes content includes real LaTeX (e.g. \mathbb{R}, \frac{a}{b}).
 * The previous implementation stripped unknown LaTeX commands, causing broken output.
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';

interface MathRendererProps {
    content: string;
    fontSize?: number;
    style?: object;
    minHeight?: number; // Allow custom minHeight for compact rendering
}

// KaTeX via CDN (lightweight + accurate LaTeX coverage).
// Note: This requires internet, but avoids bundling huge JS blobs in-app.
const KATEX_CSS_HREF = 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css';
const KATEX_JS_SRC = 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js';
const KATEX_AUTORENDER_SRC = 'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js';

/**
 * MathRenderer Component
 * Uses WebView with inline math rendering for offline LaTeX support
 */
const MathRenderer: React.FC<MathRendererProps> = ({
    content,
    fontSize = 16,
    style,
    minHeight = 20
}) => {
    const { isDarkMode } = useTheme();

    const textColor = isDarkMode ? '#E0E0E0' : '#1A1A1A';
    const accentColor = isDarkMode ? '#00E5FF' : '#6200EE';
    const bgColor = 'transparent';

    // Process content and generate HTML
    const htmlContent = useMemo(() => {
        if (!content) return '';

        // Protect LaTeX math delimiters before HTML escaping
        const MATH_PLACEHOLDER = {
            display: '___MATH_DISPLAY___',
            inline: '___MATH_INLINE___'
        };
        const mathBlocks: string[] = [];
        let processed = content;

        // Extract display math (\[...\] or $$...$$)
        processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (match, math) => {
            const idx = mathBlocks.length;
            mathBlocks.push(math.trim());
            return `${MATH_PLACEHOLDER.display}${idx}${MATH_PLACEHOLDER.display}`;
        });
        processed = processed.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
            const idx = mathBlocks.length;
            mathBlocks.push(math);
            return `${MATH_PLACEHOLDER.display}${idx}${MATH_PLACEHOLDER.display}`;
        });

        // Extract inline math (\(...\) or $...$)
        processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (match, math) => {
            const idx = mathBlocks.length;
            mathBlocks.push(math.trim());
            return `${MATH_PLACEHOLDER.inline}${idx}${MATH_PLACEHOLDER.inline}`;
        });
        processed = processed.replace(/\$([^$\n]+)\$/g, (match, math) => {
            const idx = mathBlocks.length;
            mathBlocks.push(math);
            return `${MATH_PLACEHOLDER.inline}${idx}${MATH_PLACEHOLDER.inline}`;
        });

        // Now escape HTML (math is protected)
        processed = processed
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Restore math blocks (unescaped, ready for KaTeX)
        mathBlocks.forEach((math, idx) => {
            const displayPattern = `${MATH_PLACEHOLDER.display}${idx}${MATH_PLACEHOLDER.display}`;
            const inlinePattern = `${MATH_PLACEHOLDER.inline}${idx}${MATH_PLACEHOLDER.inline}`;
            if (processed.includes(displayPattern)) {
                processed = processed.replace(displayPattern, `$$${math}$$`);
            } else if (processed.includes(inlinePattern)) {
                processed = processed.replace(inlinePattern, `$${math}$`);
            }
        });

        // Convert a small subset of markdown formatting (keeps notes readable)
        processed = processed
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br/>');

        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="${KATEX_CSS_HREF}">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: ${fontSize}px;
            line-height: 1.6;
            color: ${textColor};
            background: ${bgColor};
            padding: 8px 6px;
            word-wrap: break-word;
            overflow: hidden;
            margin: 0;
        }
        p { margin-bottom: 12px; }
        strong { font-weight: 700; color: ${accentColor}; }
        em { font-style: italic; }
        code {
            background: ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }

        /* KaTeX tuning */
        .katex { color: ${accentColor}; }
        .katex-mathml { display: none !important; }
        .katex-display { margin: 12px 0; }
        /* Avoid layout explosions; allow horizontal scroll for long equations */
        .katex-display { overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; }
        .katex-display::-webkit-scrollbar { height: 0px; }
    </style>
</head>
<body>
    <p>${processed}</p>
    <script src="${KATEX_JS_SRC}"></script>
    <script src="${KATEX_AUTORENDER_SRC}"></script>
    <script>
        function postHeight() {
          try {
            const height = Math.max(
              document.body.scrollHeight || 0,
              document.documentElement.scrollHeight || 0
            );
            window.ReactNativeWebView.postMessage(JSON.stringify({ height: height }));
          } catch (e) {}
        }

        function render() {
          try {
            if (typeof renderMathInElement === 'function') {
              renderMathInElement(document.body, {
                delimiters: [
                  {left: "$$", right: "$$", display: true},
                  {left: "$", right: "$", display: false}
                ],
                throwOnError: false,
                strict: "ignore"
              });
            }
          } catch (e) {}

          // Post height twice to account for font/layout settling
          setTimeout(postHeight, 60);
          setTimeout(postHeight, 200);
        }

        // Wait a tick for scripts to load
        setTimeout(render, 40);
    </script>
</body>
</html>`;
    }, [content, fontSize, textColor, accentColor, bgColor, isDarkMode]);

    const [webViewHeight, setWebViewHeight] = React.useState(minHeight);

    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.height && data.height > 0) {
                // Clamp height to prevent huge gaps, add small padding for safety
                const measured = Number(data.height);
                const clamped = Math.max(minHeight, Math.min(measured + 8, 5000));
                setWebViewHeight(clamped);
            }
        } catch (e) {
            // Ignore parse errors
        }
    };

    if (!content) return null;

    return (
        <View style={[styles.container, style]}>
            <WebView
                source={{ html: htmlContent }}
                style={[styles.webview, { height: Math.max(webViewHeight, minHeight) }]}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onMessage={handleMessage}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={false}
                nestedScrollEnabled={false}
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
