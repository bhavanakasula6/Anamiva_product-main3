/**
 * Loading Component
 * Displays loading indicator
 */

import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import theme from '../../styles/theme';

const Loading = ({
  size = 'large',
  color = theme.colors.primary[500],
  text,
  fullScreen = false,
  style,
}) => {
  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel={text || 'Loading'}
    >
      <ActivityIndicator
        size={size}
        color={color}
      />

      {text ? (
        <Text
          style={styles.text}
          allowFontScaling={false}
        >
          {text}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },

  fullScreen: {
    flex: 1,
    backgroundColor: theme.colors.surface.app,
  },

  text: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSizes.base,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});

export default Loading;
