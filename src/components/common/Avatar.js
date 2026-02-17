/**
 * Avatar Component
 * Displays user avatar image, initials, or icon fallback
 */

import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import Icon from '../Icon';
import theme from '../../styles/theme';

const INITIALS_SCALE = 0.42;
const ICON_SCALE = 0.5;

const Avatar = ({
  source,
  name,
  size = 40,
  rounded = true,
  backgroundColor = theme.colors.primary[500],
  textColor = theme.colors.text.inverse,
  icon = 'doctor',
  style,
}) => {
  const getInitials = (fullName) => {
    if (!fullName) return null;
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const initials = getInitials(name);

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: rounded ? size / 2 : theme.borderRadius.md,
    backgroundColor,
  };

  // Image avatar
  if (source?.uri) {
    return (
      <Image
        source={source}
        style={[styles.image, containerStyle, style]}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel={name ? `${name} avatar` : 'User avatar'}
      />
    );
  }

  return (
    <View
      style={[styles.container, containerStyle, style]}
      accessible={false}
    >
      {initials ? (
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: Math.round(size * INITIALS_SCALE),
            },
          ]}
          allowFontScaling={false}
        >
          {initials}
        </Text>
      ) : (
        <Icon
          name={icon}
          size={Math.round(size * ICON_SCALE)}
          color={textColor}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    overflow: 'hidden',
  },
  text: {
    fontFamily: theme.typography.fontFamily.semiBold,
    textAlign: 'center',
  },
});

export default Avatar;
