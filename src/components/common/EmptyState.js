/**
 * EmptyState Component
 * Displays when no data is available
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../Icon';
import Button from './Button';
import theme from '../../styles/theme';

const EmptyState = ({
  icon,              // string icon name OR ReactNode
  title,
  description,
  actionLabel,
  onAction,
  style,
}) => {
  const renderIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      return (
        <Icon
          name={icon}
          size={48}
          color="primary"
        />
      );
    }

    // Backward compatibility: render node as-is
    return icon;
  };

  return (
    <View style={[styles.container, style]} accessible={false}>
      {icon && <View style={styles.iconContainer}>{renderIcon()}</View>}

      {title && (
        <Text
          style={styles.title}
          allowFontScaling={false}
        >
          {title}
        </Text>
      )}

      {description && (
        <Text
          style={styles.description}
          allowFontScaling={false}
        >
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <Button
          onPress={onAction}
          style={styles.button}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginTop: theme.spacing.md,
  },
});

export default EmptyState;
