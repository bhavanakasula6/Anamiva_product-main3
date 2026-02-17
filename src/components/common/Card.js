/**
 * Card Component
 * Reusable container for sections, lists, and actions
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import theme from '../../styles/theme';

const PADDING_CONFIG = {
  none: 0,
  sm: theme.spacing.sm,
  md: theme.spacing.md,
  lg: theme.spacing.lg,
};

const VARIANT_CONFIG = {
  elevated: {
    backgroundColor: theme.colors.surface.card,
    borderWidth: 0,
    borderColor: 'transparent',
    shadow: theme.shadows.md,
  },
  outlined: {
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.borders.subtle,
    shadow: null,
  },
  filled: {
    backgroundColor: theme.colors.gray[50],
    borderWidth: 0,
    borderColor: 'transparent',
    shadow: null,
  },
};

const Card = ({
  children,
  onPress,
  variant = 'elevated',
  padding = 'md',
  style,
  ...props
}) => {
  const paddingValue = PADDING_CONFIG[padding] ?? PADDING_CONFIG.md;
  const variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG.elevated;

  const cardStyles = [
    styles.card,
    {
      backgroundColor: variantConfig.backgroundColor,
      borderWidth: variantConfig.borderWidth,
      borderColor: variantConfig.borderColor,
      padding: paddingValue,
    },
    variantConfig.shadow,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        accessibilityRole="button"
        style={cardStyles}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
  },
});

export default Card;
