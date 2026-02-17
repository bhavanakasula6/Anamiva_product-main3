/**
 * Badge Component
 * Small label for status, category, or count
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../styles/theme';

const SIZE_CONFIG = {
  sm: {
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs / 2,
    fontSize: theme.typography.fontSizes.xs,
  },
  md: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    fontSize: theme.typography.fontSizes.sm,
  },
  lg: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSizes.base,
  },
};

const VARIANT_CONFIG = {
  primary: {
    backgroundColor: theme.colors.primary[500],
    textColor: theme.colors.text.inverse,
  },
  secondary: {
    backgroundColor: theme.colors.secondary[500],
    textColor: theme.colors.text.inverse,
  },
  success: {
    backgroundColor: theme.colors.success[500],
    textColor: theme.colors.text.inverse,
  },
  warning: {
    backgroundColor: theme.colors.warning[400],
    textColor: theme.colors.gray[900], // readable on yellow
  },
  danger: {
    backgroundColor: theme.colors.danger[500],
    textColor: theme.colors.text.inverse,
  },
  gray: {
    backgroundColor: theme.colors.gray[200],
    textColor: theme.colors.gray[700],
  },
};

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  style,
  textStyle,
}) => {
  const sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG.md;
  const variantConfig = VARIANT_CONFIG[variant] || VARIANT_CONFIG.primary;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: variantConfig.backgroundColor,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          paddingVertical: sizeConfig.paddingVertical,
          borderRadius: rounded
            ? theme.borderRadius.full
            : theme.borderRadius.sm,
        },
        style,
      ]}
      accessible={false}
    >
      <Text
        style={[
          styles.text,
          {
            color: variantConfig.textColor,
            fontSize: sizeConfig.fontSize,
          },
          textStyle,
        ]}
        allowFontScaling={false}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: theme.typography.fontFamily.semiBold,
    textAlign: 'center',
  },
});

export default Badge;
