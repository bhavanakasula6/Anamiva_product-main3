/**
 * Divider Component
 * Visual separator line
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import theme from '../../styles/theme';

const Divider = ({
  color = theme.borders.subtle,
  thickness = 1,
  marginVertical = theme.spacing.md,
  marginHorizontal = 0,
  style,
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical,
          marginHorizontal,
        },
        style,
      ]}
      accessible={false}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

export default Divider;
