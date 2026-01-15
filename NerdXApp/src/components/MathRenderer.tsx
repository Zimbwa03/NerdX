/**
 * MathRenderer Component
 * Renders LaTeX math expressions using WebView with embedded KaTeX
 * KaTeX is bundled inline for offline support
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useTheme } from '../context/ThemeContext';

interface MathRendererProps {
    content: string;
    fontSize?: number;
    style?: object;
}

// Minimal KaTeX CSS (inlined for offline support)
const KATEX_CSS = `
.katex{font:normal 1.21em KaTeX_Main,Times New Roman,serif;line-height:1.2;text-indent:0;text-rendering:auto}
.katex *{-ms-high-contrast-adjust:none!important;border-color:currentColor}
.katex .katex-mathml{position:absolute;clip:rect(1px,1px,1px,1px);padding:0;border:0;height:1px;width:1px;overflow:hidden}
.katex .base{position:relative;display:inline-block;white-space:nowrap;width:-webkit-min-content;width:-moz-min-content;width:min-content}
.katex .strut{display:inline-block}
.katex .mord{font-family:KaTeX_Main}
.katex .mop{font-family:KaTeX_Main}
.katex .mbin{font-family:KaTeX_Main}
.katex .mrel{font-family:KaTeX_Main}
.katex .mopen{font-family:KaTeX_Main}
.katex .mclose{font-family:KaTeX_Main}
.katex .mpunct{font-family:KaTeX_Main}
.katex .minner{font-family:KaTeX_Main}
.katex .mfrac{display:inline-block;vertical-align:-0.5em;text-align:center}
.katex .mfrac>.frac-line{width:100%;border-bottom-style:solid;border-bottom-width:0.04em}
.katex .mfrac>.mfrac-num{display:block;text-align:center}
.katex .mfrac>.mfrac-den{display:block;text-align:center}
.katex .msup{vertical-align:0.4em}
.katex .msub{vertical-align:-0.3em}
.katex .sqrt{display:inline-block;vertical-align:-0.1em}
.katex .sqrt>.sqrt-sign{font-family:KaTeX_Main;position:relative}
.katex .sqrt>.vlist-t{display:inline-table;table-layout:fixed}
`;

/**
 * MathRenderer Component
 * Uses WebView with inline math rendering for offline LaTeX support
 */
const MathRenderer: React.FC<MathRendererProps> = ({
    content,
    fontSize = 16,
    style
}) => {
    const { isDarkMode } = useTheme();

    const textColor = isDarkMode ? '#E0E0E0' : '#1A1A1A';
    const accentColor = isDarkMode ? '#00E5FF' : '#6200EE';
    const bgColor = 'transparent';

    // Process content and generate HTML
    const htmlContent = useMemo(() => {
        if (!content) return '';

        let processed = content
            // Escape HTML but preserve math delimiters
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Convert LaTeX math to HTML with superscripts/subscripts/fractions
        // Handle $$...$$ display math
        processed = processed.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
            return `<div class="math-display">${latexToHtml(math)}</div>`;
        });

        // Handle $...$ inline math
        processed = processed.replace(/\$([^$]+)\$/g, (match, math) => {
            return `<span class="math-inline">${latexToHtml(math)}</span>`;
        });

        // Convert markdown formatting
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
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: ${fontSize}px;
            line-height: 1.6;
            color: ${textColor};
            background: ${bgColor};
            padding: 8px 4px;
            word-wrap: break-word;
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
        .math-display {
            display: block;
            text-align: center;
            margin: 12px 0;
            font-size: 1.1em;
            color: ${accentColor};
        }
        .math-inline {
            font-family: 'Times New Roman', serif;
            color: ${accentColor};
        }
        .fraction {
            display: inline-block;
            vertical-align: middle;
            text-align: center;
        }
        .fraction .num {
            display: block;
            border-bottom: 1px solid ${accentColor};
            padding: 0 4px;
        }
        .fraction .den {
            display: block;
            padding: 0 4px;
        }
        .sqrt {
            display: inline-block;
            border-top: 1px solid ${accentColor};
            padding: 2px 4px 0;
            margin-left: 8px;
            position: relative;
        }
        .sqrt::before {
            content: '√';
            position: absolute;
            left: -8px;
            top: 0;
        }
        sup { font-size: 0.7em; vertical-align: super; }
        sub { font-size: 0.7em; vertical-align: sub; }
    </style>
</head>
<body>
    <p>${processed}</p>
    <script>
        setTimeout(function() {
            const height = document.body.scrollHeight;
            window.ReactNativeWebView.postMessage(JSON.stringify({ height: height }));
        }, 50);
    </script>
</body>
</html>`;
    }, [content, fontSize, textColor, accentColor, bgColor, isDarkMode]);

    const [webViewHeight, setWebViewHeight] = React.useState(100);

    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.height && data.height > 0) {
                setWebViewHeight(Math.max(data.height + 20, 50));
            }
        } catch (e) {
            // Ignore parse errors
        }
    };

    if (!content) return null;

    return (
        <View style={[styles.container, { minHeight: webViewHeight }, style]}>
            <WebView
                source={{ html: htmlContent }}
                style={[styles.webview, { height: webViewHeight }]}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onMessage={handleMessage}
                originWhitelist={['*']}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scalesPageToFit={false}
            />
        </View>
    );
};

/**
 * Convert LaTeX math to HTML with proper formatting
 */
function latexToHtml(latex: string): string {
    let html = latex;

    // Handle fractions: \frac{a}{b} -> HTML fraction
    html = html.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g,
        '<span class="fraction"><span class="num">$1</span><span class="den">$2</span></span>');

    // Handle square roots: \sqrt{x} -> √x with overline
    html = html.replace(/\\sqrt\{([^}]+)\}/g, '<span class="sqrt">$1</span>');
    html = html.replace(/\\sqrt\s*(\w)/g, '<span class="sqrt">$1</span>');

    // Handle superscripts: x^2, x^{ab}
    html = html.replace(/\^{([^}]+)}/g, '<sup>$1</sup>');
    html = html.replace(/\^(\d)/g, '<sup>$1</sup>');
    html = html.replace(/\^([a-zA-Z])/g, '<sup>$1</sup>');

    // Handle subscripts: x_1, x_{ab}
    html = html.replace(/_{([^}]+)}/g, '<sub>$1</sub>');
    html = html.replace(/_(\d)/g, '<sub>$1</sub>');
    html = html.replace(/_([a-zA-Z])/g, '<sub>$1</sub>');

    // Handle common LaTeX symbols
    html = html.replace(/\\times/g, '×');
    html = html.replace(/\\div/g, '÷');
    html = html.replace(/\\pm/g, '±');
    html = html.replace(/\\mp/g, '∓');
    html = html.replace(/\\neq/g, '≠');
    html = html.replace(/\\leq/g, '≤');
    html = html.replace(/\\geq/g, '≥');
    html = html.replace(/\\lt/g, '&lt;');
    html = html.replace(/\\gt/g, '&gt;');
    html = html.replace(/\\approx/g, '≈');
    html = html.replace(/\\equiv/g, '≡');
    html = html.replace(/\\infty/g, '∞');
    html = html.replace(/\\pi/g, 'π');
    html = html.replace(/\\theta/g, 'θ');
    html = html.replace(/\\alpha/g, 'α');
    html = html.replace(/\\beta/g, 'β');
    html = html.replace(/\\gamma/g, 'γ');
    html = html.replace(/\\delta/g, 'δ');
    html = html.replace(/\\Delta/g, 'Δ');
    html = html.replace(/\\epsilon/g, 'ε');
    html = html.replace(/\\lambda/g, 'λ');
    html = html.replace(/\\mu/g, 'μ');
    html = html.replace(/\\sigma/g, 'σ');
    html = html.replace(/\\Sigma/g, 'Σ');
    html = html.replace(/\\omega/g, 'ω');
    html = html.replace(/\\Omega/g, 'Ω');
    html = html.replace(/\\sum/g, 'Σ');
    html = html.replace(/\\prod/g, '∏');
    html = html.replace(/\\int/g, '∫');
    html = html.replace(/\\partial/g, '∂');
    html = html.replace(/\\nabla/g, '∇');
    html = html.replace(/\\cdot/g, '·');
    html = html.replace(/\\ldots/g, '…');
    html = html.replace(/\\rightarrow/g, '→');
    html = html.replace(/\\leftarrow/g, '←');
    html = html.replace(/\\leftrightarrow/g, '↔');
    html = html.replace(/\\Rightarrow/g, '⇒');
    html = html.replace(/\\Leftarrow/g, '⇐');
    html = html.replace(/\\forall/g, '∀');
    html = html.replace(/\\exists/g, '∃');
    html = html.replace(/\\in/g, '∈');
    html = html.replace(/\\notin/g, '∉');
    html = html.replace(/\\subset/g, '⊂');
    html = html.replace(/\\subseteq/g, '⊆');
    html = html.replace(/\\cup/g, '∪');
    html = html.replace(/\\cap/g, '∩');
    html = html.replace(/\\emptyset/g, '∅');
    html = html.replace(/\\perp/g, '⊥');
    html = html.replace(/\\angle/g, '∠');
    html = html.replace(/\\degree/g, '°');

    // Handle \text{...}
    html = html.replace(/\\text\{([^}]+)\}/g, '<span style="font-family: inherit;">$1</span>');

    // Handle \left and \right (just remove them, keep brackets)
    html = html.replace(/\\left\(/g, '(');
    html = html.replace(/\\right\)/g, ')');
    html = html.replace(/\\left\[/g, '[');
    html = html.replace(/\\right\]/g, ']');
    html = html.replace(/\\left\\{/g, '{');
    html = html.replace(/\\right\\}/g, '}');
    html = html.replace(/\\left\|/g, '|');
    html = html.replace(/\\right\|/g, '|');

    // Remove remaining backslashes from unknown commands
    html = html.replace(/\\([a-zA-Z]+)/g, '$1');
    html = html.replace(/\\\\/g, '');

    // Clean up extra braces
    html = html.replace(/\{([^{}]+)\}/g, '$1');

    return html;
}

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
