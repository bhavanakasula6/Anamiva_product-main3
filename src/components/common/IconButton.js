import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Icon from '../Icon';
import theme from '../../styles/theme';

/**
 * IconButton
 *
 * Props:
 * - icon (string)        → icon name (required)
 * - onPress (function)  → press handler (required)
 * - size ('sm'|'md'|'lg'|number)
 * - color (theme key | hex)
 * - background ('none' | 'soft' | 'solid')
 * - label (string)
 * - disabled (boolean)
 * - style (object)
 */

const SIZE_CONFIG = {
  sm: 32,
  md: 40,
  lg: 48,
};

const resolveColor = (color) => {
  if (!color) return theme.colors.text.primary;

  if (typeof color === 'string' && color.startsWith('#')) {
    return color;
  }

  if (theme.colors[color]?.[500]) {
    return theme.colors[color][500];
  }

  if (theme.colors.text?.[color]) {
    return theme.colors.text[color];
  }

  if (theme.statusText?.[color]) {
    return theme.statusText[color];
  }

  return theme.colors.text.primary;
};

const getSoftBackground = (color) => `${color}22`;

const IconButton = ({
  icon,
  onPress,
  size = 'md',
  color = 'primary',
  background = 'none',
  label,
  disabled = false,
  style,
}) => {
  const buttonSize =
    typeof size === 'number'
      ? size
      : SIZE_CONFIG[size] || SIZE_CONFIG.md;

  const resolvedColor = resolveColor(color);

  const backgroundColor =
    background === 'solid'
      ? resolvedColor
      : background === 'soft'
      ? getSoftBackground(resolvedColor)
      : 'transparent';

  const iconColor =
    background === 'solid'
      ? theme.colors.text.inverse
      : resolvedColor;

  const iconSize = Math.round(buttonSize * 0.55);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label || icon}
      accessibilityState={{ disabled }}
      hitSlop={10}
      style={({ pressed }) => [
        styles.base,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: buttonSize / 2,
          backgroundColor,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Icon
        name={icon}
        size={iconSize}
        color={iconColor}
      />

      {label ? (
        <Text
          style={styles.label}
          allowFontScaling={false}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: theme.spacing.xs / 2,
    fontSize: theme.typography.fontSizes.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default IconButton;
