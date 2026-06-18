/**
 * Login Screen
 * Phone number entry for authentication
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import { colors, typography, spacing } from '../../styles/theme';
import { Button, Input } from '../../components/common';
import { normalizePhone, validatePhone } from '../../utils/validation';

const LoginScreen = ({ navigation }) => {
  const { sendOTP } = useAuth();

  const [phone, setPhone] = useState('');
  const [countryCode] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef(null);
  const requestInFlightRef = useRef(false);

  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(cooldownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(cooldownRef.current);
  }, [cooldown]);

  const handleSendOTP = async () => {
    if (loading || requestInFlightRef.current) return; // Prevent duplicate sends

    const normalizedPhone = normalizePhone(phone);
    setPhone(normalizedPhone);

    if (!validatePhone(normalizedPhone)) {
      setErrors({ phone: 'Enter a valid 10-digit phone number' });
      return;
    }

    setErrors({});
    requestInFlightRef.current = true;
    setLoading(true);

    try {
      const fullPhone = `${countryCode}${normalizedPhone}`;
      const response = await sendOTP(fullPhone);

      if (response?.success) {
        setCooldown(30);
        navigation.navigate('OTPVerification', { phone: fullPhone });
      } else {
        Alert.alert('Error', response?.message || 'Failed to send OTP');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      requestInFlightRef.current = false;
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* CONTENT */}
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoWrapper}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>M</Text>
                {/* <Image
                  source={require('../../assets/logo.png')}
                  style={{ width: 56, height: 56, resizeMode: 'contain' }}
                /> */}

              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>Welcome to MedApp</Text>
            <Text style={styles.subtitle}>
              Enter your phone number to continue
            </Text>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>Phone Number</Text>

              <View style={styles.phoneRow}>
                <View style={styles.countryCodeBox}>
                  <Text style={styles.countryCode}>{countryCode}</Text>
                </View>

                <View style={styles.phoneInputContainer}>
                  <Input
                    value={phone}
                    onChangeText={text => {
                      setPhone(normalizePhone(text));
                      setErrors({});
                    }}
                    placeholder="10-digit mobile number"
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    autoComplete="tel"
                    maxLength={20}
                    error={errors.phone}
                    style={styles.phoneInput}
                  />
                </View>
              </View>

              <Button
                fullWidth
                size="md"
                loading={loading}
                disabled={!validatePhone(phone) || cooldown > 0 || loading}
                onPress={handleSendOTP}
                style={styles.button}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Send OTP'}
              </Button>

              <Text style={styles.helperText}>
                We’ll send a one-time password for verification
              </Text>
            </View>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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

  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
  },

  logoWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },

  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    fontSize: 42,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary[500],
  },

  title: {
    fontSize: typography.fontSize['3xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
    textAlign: 'center',
  },

  form: {
    marginTop: spacing['2xl'],
  },

  label: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },

  phoneRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  countryCodeBox: {
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
  },
  countryCode: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[900],
  },
  phoneInputContainer: {
    flex: 1,
  },
  phoneInput: {
    marginBottom: 0,
  },
  button: {
    marginTop: spacing.xl,
  },
  helperText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  footerText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
    textAlign: 'center',
  },
});

export default LoginScreen;
