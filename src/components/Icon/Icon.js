import React from 'react';
import { Text } from 'react-native';
import { ICONS, EMOJI_FALLBACK } from './icons';
import theme from '../../styles/theme';

/**
 * Icon Component
 *
 * Props:
 * - name: string (required)
 * - size: number | 'xs' | 'sm' | 'md' | 'lg'
 * - color: theme token or hex
 * - style: optional style override
 */

const SIZE_MAP = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

/**
 * Resolve theme color safely
 */
const resolveColor = (color) => {
  if (!color) return theme.colors.text.primary;

  // Hex or rgba
  if (typeof color === 'string' && color.startsWith('#')) {
    return color;
  }

  // Palette colors (primary, secondary, danger, etc.)
  if (theme.colors[color]?.[500]) {
    return theme.colors[color][500];
  }

  // Text colors
  if (theme.colors.text?.[color]) {
    return theme.colors.text[color];
  }

  // Status text colors
  if (theme.statusText?.[color]) {
    return theme.statusText[color];
  }

  return theme.colors.text.primary;
};

const Icon = ({ name, size = 'md', color = 'primary', style }) => {
  const iconDef = ICONS[name];
  const iconSize = typeof size === 'number' ? size : SIZE_MAP[size] || SIZE_MAP.md;
  const resolvedColor = resolveColor(color);

  if (iconDef) {
    const VectorIcon = iconDef.lib;
    return (
      <VectorIcon
        name={iconDef.name}
        size={iconSize}
        color={resolvedColor}
        style={style}
        accessibilityRole="image"
        accessible={false}
      />
    );
  }

  // Emoji fallback
  return (
    <Text
      style={{ fontSize: iconSize, color: theme.colors.text.primary }}
      accessible={false}
    >
      {EMOJI_FALLBACK[name] || '❓'}
    </Text>
  );
};

export default Icon;
