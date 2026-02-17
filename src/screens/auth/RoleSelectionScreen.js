/**
 * Role Selection Screen
 * Choose between Patient and Doctor roles
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../styles/theme';
import { Button } from '../../components/common';
import { USER_ROLES } from '../../data/constants';
import Icon from '../../components/Icon';

const RoleSelectionScreen = ({ navigation, route }) => {
  const { phone } = route.params;
  const { selectRole } = useAuth();

  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: USER_ROLES.PATIENT,
      title: 'Patient',
      subtitle: 'Access healthcare services',
      description:
        'Book appointments, manage your medical records, request emergency care, and track medications.',
      features: [
        'Find and book doctors',
        'Emergency care requests',
        'Medical records management',
        'Medication tracking',
      ],
    },
    {
      id: USER_ROLES.DOCTOR,
      title: 'Doctor',
      subtitle: 'Provide medical care',
      description:
        'Manage appointments, respond to emergencies, view patient records, and prescribe treatments.',
      features: [
        'Manage appointments',
        'Respond to emergencies',
        'Access patient records',
        'Prescribe medications',
      ],
    },
  ];

  const handleContinue = async () => {
    if (!selectedRole) return;

    setLoading(true);
    try {
      await selectRole(phone, selectedRole);

      if (selectedRole === USER_ROLES.PATIENT) {
        navigation.navigate('PatientProfileSetup', {
          phone,
          role: selectedRole,
        });
      } else {
        navigation.navigate('DoctorProfileSetup', {
          phone,
          role: selectedRole,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ROLE</Text>
            </View>

            <Text style={styles.title}>Choose how you’ll use MedApp</Text>
            <Text style={styles.subtitle}>
              Select the role that best describes you
            </Text>
          </View>

          {/* Role Cards */}
          <View style={styles.cards}>
            {roles.map(role => {
              const selected = selectedRole === role.id;

              return (
                <TouchableOpacity
                  key={role.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedRole(role.id)}
                  style={[
                    styles.card,
                    selected && styles.cardSelected,
                  ]}
                >
                  {/* Header */}
                  <View style={styles.cardHeader}>
                    <View>
                      <Icon
                        name={role.id === USER_ROLES.PATIENT ? 'patient' : 'doctor'}
                        size={36}
                        color={selected ? colors.primary[500] : colors.gray[600]}
                        style={{ marginBottom: spacing.md }}
                      />

                      <Text style={styles.cardTitle}>
                        {role.title}
                      </Text>
                      <Text style={styles.cardSubtitle}>
                        {role.subtitle}
                      </Text>
                    </View>

                    {selected && (
                      <View style={styles.checkCircle}>
                        <Icon
                          name="checkCircleFilled"
                          size={18}
                          color={colors.white}
                        />
                      </View>
                    )}

                  </View>

                  {/* Description */}
                  <Text style={styles.description}>
                    {role.description}
                  </Text>

                  {/* Features */}
                  <View style={styles.features}>
                    {role.features.map((f, i) => (
                      <View key={i} style={styles.featureRow}>
                        <View style={styles.dot} />
                        <Text style={styles.featureText}>
                          {f}
                        </Text>
                      </View>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Bottom Action */}
        <View style={styles.footer}>
          <Button
            fullWidth
            size="md"
            loading={loading}
            disabled={!selectedRole}
            onPress={handleContinue}
          >
            Continue
          </Button>
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
    backgroundColor: colors.white,
  },

  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.md,
  },

  header: {
    marginBottom: spacing['2xl'],
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary[50],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },

  badgeText: {
    fontSize: typography.fontSize.xs,
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

  cards: {
    gap: spacing.lg,
  },

  card: {
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    backgroundColor: colors.white,
    ...shadows.sm,
  },

  cardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  cardTitle: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
  },

  cardSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing.xs / 2,
  },

  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },

  description: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
    marginBottom: spacing.md,
  },

  features: {
    marginTop: spacing.sm,
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary[500],
    marginRight: spacing.sm,
  },

  featureText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.white,
  },
});

export default RoleSelectionScreen;
