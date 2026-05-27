/**
 * OTP Verification Screen
 * Enter and verify OTP code
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import {
  colors,
  typography,
  spacing,
  borderRadius,
} from '../../styles/theme';
import { Button } from '../../components/common';

const OTPVerificationScreen = ({ navigation, route }) => {
  const { phone } = route.params;
  const { verifyOTP, sendOTP } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  /* ---------- RESEND TIMER ---------- */
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(v => v - 1), 1000);
      return () => clearTimeout(t);
    }
    setCanResend(true);
  }, [resendTimer]);

  /* ---------- OTP INPUT ---------- */
  const handleOtpChange = (index, value) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ---------- VERIFY ---------- */
  const handleVerifyOTP = async () => {
    const code = otp.join('');

    if (code.length !== 6) {
      Alert.alert('Error', 'Enter the complete OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTP(phone, code);

      if (res?.success) {
        if (res.isNewUser) {
          navigation.replace('RoleSelection', { phone });
        }
        // For existing users: AuthContext.login() sets isAuthenticated=true,
        // RootNavigator auto-switches to Main. No manual navigation needed.
      } else {
        throw new Error(res?.message || 'Invalid OTP');
      }
    } catch (e) {
      Alert.alert('Error', e.message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  /* ---------- RESEND ---------- */
  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      const res = await sendOTP(phone);
      if (res?.success) {
        setOtp(['', '', '', '', '', '']);
        setResendTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        throw new Error(res?.message);
      }
    } catch {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>OTP</Text>
            </View>

            <Text style={styles.title}>Verify your number</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to
            </Text>
            <Text style={styles.phone}>{phone}</Text>
          </View>

          {/* OTP INPUT */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={v => handleOtpChange(index, v)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(index, nativeEvent.key)
                }
                style={[
                  styles.otpInput,
                  digit && styles.otpFilled,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* VERIFY BUTTON */}
          <Button
            fullWidth
            size="md"
            loading={loading}
            disabled={otp.join('').length !== 6}
            onPress={handleVerifyOTP}
            style={styles.verifyButton}
          >
            Verify OTP
          </Button>

          {/* RESEND */}
          <View style={styles.resendRow}>
            <Text style={styles.resendText}>
              Didn’t receive the code?
            </Text>

            <TouchableOpacity
              disabled={!canResend}
              onPress={handleResendOTP}
            >
              <Text
                style={[
                  styles.resendLink,
                  !canResend && styles.resendDisabled,
                ]}
              >
                {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* CHANGE NUMBER */}
          <TouchableOpacity
            style={styles.changeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.changeText}>
              Change phone number
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },

  iconText: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[500],
    letterSpacing: 1,
  },

  title: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
  },

  phone: {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary[500],
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  otpInput: {
    width: 48,
    height: 58,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.gray[300],
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    textAlign: 'center',
    color: colors.gray[900],
    backgroundColor: colors.white,
  },

  otpFilled: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },

  helper: {
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    marginBottom: spacing.xl,
  },

  helperBold: {
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[500],
  },

  verifyButton: {
    marginBottom: spacing.lg,
  },

  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },

  resendText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },

  resendLink: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary[500],
  },

  resendDisabled: {
    color: colors.gray[400],
  },

  changeButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },

  changeText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
});

export default OTPVerificationScreen;
