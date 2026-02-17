/**
 * SearchBar Component
 * Reusable search input with icon and clear action
 */

import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from '../Icon';
import IconButton from './IconButton';
import theme from '../../styles/theme';

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search…',
  onClear,
  icon = 'search',
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  ...props
}) => {
  const renderLeftIcon = () => {
    if (!icon) return null;

    if (typeof icon === 'string') {
      return (
        <Icon
          name={icon}
          size={18}
          color={theme.colors.text.secondary}
        />
      );
    }

    return icon;
  };

  const renderRightIcon = () => {
    // Clear action has highest priority
    if (value && onClear) {
      return (
        <IconButton
          icon="x"
          size="sm"
          onPress={onClear}
          accessibilityLabel="Clear search"
        />
      );
    }

    if (!rightIcon) return null;

    if (typeof rightIcon === 'string') {
      return (
        <IconButton
          icon={rightIcon}
          size="sm"
          onPress={onRightIconPress}
          disabled={!onRightIconPress}
        />
      );
    }

    return rightIcon;
  };

  return (
    <View style={[styles.container, style]}>
      {/* Left Icon */}
      {icon && (
        <View style={styles.iconLeft}>
          {renderLeftIcon()}
        </View>
      )}

      {/* Input */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.muted}
        style={[
          styles.input,
          inputStyle,
        ]}
        returnKeyType="search"
        accessibilityRole="search"
        {...props}
      />

      {/* Right / Clear Icon */}
      {(value && onClear) || rightIcon ? (
        <View style={styles.iconRight}>
          {renderRightIcon()}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface.card,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.borders.subtle,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },

  iconLeft: {
    marginRight: theme.spacing.sm,
  },

  input: {
    flex: 1,
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    padding: 0, // prevents height jump on Android
  },

  iconRight: {
    marginLeft: theme.spacing.sm,
  },
});

export default SearchBar;
