/**
 * Incoming Call Modal
 * Full-screen overlay shown to patient when doctor starts a video call
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Avatar } from './index';
import Icon from '../Icon';
import { colors, spacing, typography } from '../../styles/theme';

const IncomingCallModal = ({ visible, doctorName, doctorAvatar, onAccept, onDecline }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const autoDeclineTimer = useRef(null);

  // Pulse animation for the call indicator
  useEffect(() => {
    if (!visible) return;

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [visible]);

  // Vibration feedback and auto-dismiss after 60 seconds
  useEffect(() => {
    if (!visible) {
      if (autoDeclineTimer.current) clearTimeout(autoDeclineTimer.current);
      return;
    }

    // Vibrate on incoming call
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // Repeat vibration every 3 seconds
    const vibrateInterval = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 3000);

    // Auto-dismiss after 60 seconds
    autoDeclineTimer.current = setTimeout(() => {
      onDecline?.();
    }, 60000);

    return () => {
      clearInterval(vibrateInterval);
      if (autoDeclineTimer.current) clearTimeout(autoDeclineTimer.current);
    };
  }, [visible, onDecline]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Avatar with pulse */}
          <Animated.View style={[styles.avatarContainer, { transform: [{ scale: pulseAnim }] }]}>
            <Avatar
              source={{ uri: doctorAvatar }}
              size={100}
              name={doctorName}
            />
          </Animated.View>

          {/* Call info */}
          <Text style={styles.callerName}>{doctorName || 'Doctor'}</Text>
          <Text style={styles.callLabel}>Incoming Video Call</Text>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.declineButton]}
              onPress={onDecline}
              activeOpacity={0.8}
            >
              <Icon name="phone-off" size={28} color={colors.white} />
              <Text style={styles.actionText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.acceptButton]}
              onPress={onAccept}
              activeOpacity={0.8}
            >
              <Icon name="video" size={28} color={colors.white} />
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  avatarContainer: {
    marginBottom: spacing.xl,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.success[400],
    padding: 4,
  },
  callerName: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  callLabel: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[300],
    marginBottom: spacing['3xl'] || 48,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing['3xl'] || 48,
  },
  actionButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: colors.danger[500],
  },
  acceptButton: {
    backgroundColor: colors.success[500],
  },
  actionText: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    marginTop: 4,
  },
});

export default IncomingCallModal;
