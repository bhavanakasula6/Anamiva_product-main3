/**
 * Emergency Request Screen
 * Create emergency medical request with location
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePatient } from '../../contexts/PatientContext';
import {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../styles/theme';

import {
  Button,
  Input,
  Card,
  Header,
} from '../../components/common';

import Icon from '../../components/Icon';

const EmergencyRequestScreen = ({ navigation }) => {
  const { createEmergencyRequest } = usePatient();

  const [urgency, setUrgency] = useState('high');
  const [symptoms, setSymptoms] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const urgencyLevels = [
    {
      id: 'high',
      label: 'Critical',
      icon: 'alert-triangle',
      color: colors.danger[500],
    },
    {
      id: 'medium',
      label: 'Moderate',
      icon: 'warning',
      color: colors.warning[500],
    },
    {
      id: 'low',
      label: 'Low',
      icon: 'info',
      color: colors.primary[500],
    },
  ];

  const handleSubmit = async () => {
    if (!symptoms.trim()) {
      Alert.alert('Error', 'Please describe your symptoms');
      return;
    }

    Alert.alert(
      'Confirm Emergency Request',
      'An emergency request will be sent to nearby doctors. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);

            const response = await createEmergencyRequest({
              urgency,
              symptoms,
              description,
              location: {
                latitude: 19.076,
                longitude: 72.8777,
                address: 'Current Location',
              },
            });

            setLoading(false);

            if (response?.success) {
              navigation.replace('EmergencyActive', {
                requestId: response.request.id,
              });
            } else {
              Alert.alert(
                'Error',
                response?.message || 'Failed to send request'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Emergency Request"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning */}
        <Card style={styles.warningCard}>
          <Icon
            name="alert-triangle"
            size={40}
            color={colors.danger[600]}
          />
          <Text style={styles.warningTitle}>
            Emergency Medical Assistance
          </Text>
          <Text style={styles.warningText}>
            Use this only for urgent medical situations.
            For life-threatening emergencies, call 108.
          </Text>
        </Card>

        {/* Urgency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Urgency Level</Text>

          <View style={styles.urgencyGrid}>
            {urgencyLevels.map(level => {
              const isActive = urgency === level.id;

              return (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.urgencyCard,
                    isActive && {
                      borderColor: level.color,
                      backgroundColor: `${level.color}15`,
                    },
                  ]}
                  onPress={() => setUrgency(level.id)}
                >
                  <Icon
                    name={level.icon}
                    size={28}
                    color={isActive ? level.color : colors.gray[500]}
                  />
                  <Text
                    style={[
                      styles.urgencyLabel,
                      isActive && { color: level.color },
                    ]}
                  >
                    {level.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Symptoms */}
        <View style={styles.section}>
          <Input
            label="Symptoms *"
            value={symptoms}
            onChangeText={setSymptoms}
            placeholder="Describe your symptoms..."
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Additional Details */}
        <View style={styles.section}>
          <Input
            label="Additional Details"
            value={description}
            onChangeText={setDescription}
            placeholder="Any other information..."
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Location */}
        <Card style={styles.locationCard}>
          <Icon
            name="map-pin"
            size={32}
            color={colors.primary[500]}
          />
          <Text style={styles.locationTitle}>
            Your Location
          </Text>
          <Text style={styles.locationText}>
            Your current location will be shared with nearby doctors
          </Text>
        </Card>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <Button
          onPress={handleSubmit}
          loading={loading}
          variant="danger"
          fullWidth
          size="lg"
        >
          Send Emergency Request
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },

  warningCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.danger[50],
    borderLeftWidth: 4,
    borderLeftColor: colors.danger[500],
    alignItems: 'center',
  },
  warningTitle: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.danger[700],
  },
  warningText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.danger[600],
    textAlign: 'center',
  },

  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
    color: colors.gray[900],
  },

  urgencyGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  urgencyCard: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  urgencyLabel: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[700],
  },

  locationCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  locationTitle: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
  },
  locationText: {
    marginTop: spacing.xs,
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    textAlign: 'center',
  },

  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    ...shadows.xl,
  },
});

export default EmergencyRequestScreen;
