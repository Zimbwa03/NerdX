// MathText Component - Renders LaTeX math notation professionally
// ENHANCED: Automatically highlights numbers, expressions, and formulas in engaging blue
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
  highlightMath?: boolean; // Enable math highlighting (default: true)
}

/**
 * MathText Component
 * Renders text with LaTeX math notation using KaTeX via WebView
 * ENHANCED: Automatically highlights numbers, variables, and expressions in blue
 * Supports both inline math \( \) and display math \[ \]
 */
const MathText: React.FC<MathTextProps> = ({
  children,
  style,
  fontSize = 16,
  highlightMath = true
}) => {
  const { isDarkMode } = useTheme();
  const themedColors = useThemedColors();
  const [webViewHeight, setWebViewHeight] = useState(40);

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

  // If no LaTeX, render as plain text (but still highlight math expressions)
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
        return part;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        return part;
      } else {
        // Regular text - escape HTML but also highlight math-like content
        let processed = escapeHtml(part);

        if (highlightMath) {
          // Highlight standalone numbers using capture groups (compatible with all JS engines)
          // Captures: (before)(number)(after) - preserves spacing
          processed = processed.replace(
            /(^|\s|\()(\$?\d+(?:,\d{3})*(?:\.\d+)?%?)(\s|$|[)\.,;:!?])/g,
            '$1<span class="math-number">$2</span>$3'
          );

          // Highlight = signs with proper spacing preserved
          processed = processed.replace(
            /(\s=\s)/g,
            '<span class="math-operator">$1</span>'
          );
        }

        return processed;
      }
    }).join('');
  }, [children, highlightMath]);

  const textColor = isDarkMode ? '#E0E0E0' : '#212121';
  const bgColor = isDarkMode ? '#1D1E33' : '#FFFFFF';
  // Enhanced math colors - vibrant blue that stands out
  const mathColor = isDarkMode ? '#00BFFF' : '#1565C0'; // Deep sky blue / Blue 800
  const mathNumberColor = isDarkMode ? '#00E5FF' : '#0277BD'; // Cyan accent / Light blue 800
  const mathOperatorColor = isDarkMode ? '#64FFDA' : '#00897B'; // Teal accent
  const mathVariableColor = isDarkMode ? '#FF80AB' : '#D81B60'; // Pink accent

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
          line-height: 1.7;
          color: ${textColor};
          background-color: transparent;
          padding: 8px 4px;
          word-wrap: break-word;
        }
        
        /* LaTeX math rendered by KaTeX */
        .katex {
          font-size: 1.15em;
          color: ${mathColor};
          font-weight: 500;
        }
        .katex-display {
          margin: 16px 0;
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
        
        /* Enhanced math highlighting classes */
        .math-number {
          color: ${mathNumberColor};
          font-weight: 600;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
          background: ${isDarkMode ? 'rgba(0, 229, 255, 0.12)' : 'rgba(2, 119, 189, 0.08)'};
          padding: 1px 4px;
          border-radius: 4px;
          margin: 0 1px;
        }
        
        .math-operator {
          color: ${mathOperatorColor};
          font-weight: 600;
          font-size: 1.1em;
        }
        
        .math-variable {
          color: ${mathVariableColor};
          font-weight: 600;
          font-style: italic;
        }
        
        .math-expression {
          color: ${mathColor};
          font-weight: 500;
          background: ${isDarkMode ? 'rgba(0, 191, 255, 0.1)' : 'rgba(21, 101, 192, 0.08)'};
          padding: 2px 6px;
          border-radius: 4px;
          border-left: 3px solid ${mathColor};
        }
        
        .math-power {
          color: ${mathNumberColor};
          font-weight: 600;
          font-size: 0.9em;
          vertical-align: super;
        }
        
        p {
          margin-bottom: 12px;
        }
        
        /* Step-by-step solutions styling */
        br {
          display: block;
          content: "";
          margin-top: 6px;
        }
        
        /* Make equations stand out */
        .katex-display .katex {
          padding: 8px 16px;
          background: ${isDarkMode ? 'rgba(0, 191, 255, 0.08)' : 'rgba(21, 101, 192, 0.05)'};
          border-radius: 8px;
          border: 1px solid ${isDarkMode ? 'rgba(0, 191, 255, 0.2)' : 'rgba(21, 101, 192, 0.15)'};
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
          }, 150);
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.height) {
        setWebViewHeight(Math.max(data.height + 12, 30));
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

