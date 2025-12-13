// MathText Component - Renders LaTeX math notation professionally
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';
import { useThemedColors } from '../theme/useThemedStyles';

const { width: screenWidth } = Dimensions.get('window');

interface MathTextProps {
  children: string;
  style?: object;
  fontSize?: number;
}

/**
 * MathText Component
 * Renders text with LaTeX math notation using KaTeX via WebView
 * Supports both inline math \( \) and display math \[ \]
 */
const MathText: React.FC<MathTextProps> = ({
  children,
  style,
  fontSize = 16
}) => {
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [webViewHeight, setWebViewHeight] = useState(100);

  // Handle null/undefined children
  if (!children || typeof children !== 'string') {
    return null;
  }

  // Check if text contains LaTeX patterns
  const hasLatex = useMemo(() => {
    if (!children) return false;
    const latexPatterns = [
      /\\\(/,           // \( inline math start
      /\\\)/,           // \) inline math end
      /\\\[/,           // \[ display math start
      /\\\]/,           // \] display math end
      /\$[^$]+\$/,      // $...$ inline math
      /\$\$[^$]+\$\$/,  // $$...$$ display math
      /\\frac/,         // fractions
      /\\sqrt/,         // square roots
      /\\times/,        // multiplication
      /\\div/,          // division
      /\\pm/,           // plus/minus
      /\\leq/,          // less than or equal
      /\\geq/,          // greater than or equal
      /\\neq/,          // not equal
      /\\text\{/,       // text blocks
      /\^{/,            // superscripts
      /_{/,             // subscripts
    ];
    return latexPatterns.some(pattern => pattern.test(children));
  }, [children]);

  // If no LaTeX, render as plain text
  if (!hasLatex) {
    return (
      <Text style={[styles.plainText, { color: themedColors.text.primary }, style]}>
        {children}
      </Text>
    );
  }

  // Escape special characters and prepare content for HTML
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  // Process the text to convert LaTeX markers for KaTeX auto-render
  const processedContent = useMemo(() => {
    if (!children) return '';

    let content = children;

    // Convert \( \) to $ $ for KaTeX auto-render inline math
    content = content.replace(/\\\(/g, '$');
    content = content.replace(/\\\)/g, '$');

    // Convert \[ \] to $$ $$ for KaTeX display math
    content = content.replace(/\\\[/g, '$$');
    content = content.replace(/\\\]/g, '$$');

    // Split by math delimiters and process
    const parts = content.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        // Display math - keep as is for KaTeX
        return part;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        // Inline math - keep as is for KaTeX
        return part;
      } else {
        // Regular text - escape HTML
        return escapeHtml(part);
      }
    }).join('');
  }, [children]);

  const textColor = isDarkMode ? '#E0E0E0' : '#212121';
  const bgColor = isDarkMode ? '#1D1E33' : '#FFFFFF';
  const linkColor = isDarkMode ? '#00E5FF' : '#1976D2';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          font-size: ${fontSize}px;
          line-height: 1.6;
          color: ${textColor};
          background-color: transparent;
          padding: 8px 4px;
          word-wrap: break-word;
        }
        .katex {
          font-size: 1.1em;
          color: ${linkColor};
        }
        .katex-display {
          margin: 12px 0;
          overflow-x: auto;
          overflow-y: hidden;
        }
        .katex-display > .katex {
          display: inline-block;
          white-space: nowrap;
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          text-align: center;
        }
        p {
          margin-bottom: 8px;
        }
        /* Style for step-by-step solutions */
        br {
          display: block;
          content: "";
          margin-top: 4px;
        }
      </style>
    </head>
    <body>
      <div id="content">${processedContent.replace(/\n/g, '<br>')}</div>
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          renderMathInElement(document.getElementById("content"), {
            delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false},
              {left: '\\\\[', right: '\\\\]', display: true},
              {left: '\\\\(', right: '\\\\)', display: false}
            ],
            throwOnError: false,
            strict: false
          });
          
          // Send height to React Native
          setTimeout(function() {
            const height = document.body.scrollHeight;
            window.ReactNativeWebView.postMessage(JSON.stringify({ height: height }));
          }, 100);
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.height) {
        setWebViewHeight(Math.max(data.height + 20, 50));
      }
    } catch (e) {
      // Ignore parsing errors
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        source={{ html: htmlContent }}
        style={[styles.webView, { height: webViewHeight }]}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        originWhitelist={['*']}
        backgroundColor="transparent"
        mixedContentMode="always"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  webView: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  plainText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default MathText;
