// MathText Component - now renders plain text (Unicode math) without WebView/KaTeX
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useThemedColors } from '../theme/useThemedStyles';

interface MathTextProps {
  children: string;
  style?: object;
  fontSize?: number;
}

/**
 * MathText Component
 * Renders math as plain Unicode text (no LaTeX/KaTeX)
 * The backend already normalizes math to Unicode (x², √, π, etc.)
 */
const MathText: React.FC<MathTextProps> = ({ children, style, fontSize = 16 }) => {
  const themedColors = useThemedColors();

  if (!children || typeof children !== 'string') {
    return null;
  }

  return (
    <Text
      style={[
        styles.text,
        { color: themedColors.text.primary, fontSize, lineHeight: fontSize * 1.4 },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    width: '100%',
  },
});

export default MathText;

