/**
 * Modal Component
 * Reusable modal with customizable content
 */

import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
} from 'react-native';
import IconButton from './IconButton';
import theme from '../../styles/theme';

const Modal = ({
  visible,
  onClose,
  title,
  children,
  showCloseButton = true,
  footer,
  size = 'md',
  animationType = 'slide',
  transparent = true,
  closeOnBackdrop = true,
  style,
  ...props
}) => {
  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'full':
        return styles.sizeFull;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
      {...props}
    >
      <TouchableWithoutFeedback
        disabled={!closeOnBackdrop}
        onPress={onClose}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modal,
                getSizeStyle(),
                style,
              ]}
              accessibilityViewIsModal
              accessibilityRole="dialog"
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <View style={styles.header}>
                  <View style={styles.headerTitle}>
                    {title ? (
                      <Text
                        style={styles.title}
                        numberOfLines={1}
                        allowFontScaling={false}
                      >
                        {title}
                      </Text>
                    ) : null}
                  </View>

                  {showCloseButton && (
                    <IconButton
                      icon="x"
                      onPress={onClose}
                      size="sm"
                      background="soft"
                      accessibilityLabel="Close dialog"
                    />
                  )}
                </View>
              )}

              {/* Content */}
              <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {children}
              </ScrollView>

              {/* Footer */}
              {footer ? (
                <View style={styles.footer}>
                  {footer}
                </View>
              ) : null}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },

  modal: {
    backgroundColor: theme.colors.surface.elevated,
    borderRadius: theme.borderRadius.lg,
    maxHeight: '90%',
    width: '100%',
    ...theme.shadows.xl,
  },

  /* ---------- Sizes ---------- */
  sizeSm: {
    width: '80%',
  },
  sizeMd: {
    width: '90%',
  },
  sizeLg: {
    width: '95%',
  },
  sizeFull: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    maxHeight: '100%',
  },

  /* ---------- Header ---------- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.borders.subtle,
  },

  headerTitle: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },

  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontFamily: theme.typography.fontFamily.semiBold,
    color: theme.colors.text.primary,
  },

  /* ---------- Content ---------- */
  content: {
    flex: 1,
  },

  contentContainer: {
    padding: theme.spacing.md,
  },

  /* ---------- Footer ---------- */
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.borders.subtle,
  },
});

export default Modal;
