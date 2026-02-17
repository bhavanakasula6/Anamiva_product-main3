/**
 * Emergency List Screen
 * Display emergency requests for doctors
 */

import { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Card, EmptyState, Header } from '../../components/common';
import Icon from '../../components/Icon';
import { useDoctor } from '../../contexts/DoctorContext';
import { borderRadius, colors, shadows, spacing, typography } from '../../styles/theme';

const EmergencyListScreen = ({ navigation }) => {
  const {
    emergencyRequests,
    loadNearbyEmergencies,
    acceptEmergencyRequest,
  } = useDoctor();

  useEffect(() => {
    loadNearbyEmergencies(19.076, 72.8777); // mock location
  }, []);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return colors.danger[500];
      case 'medium':
        return colors.warning[500];
      case 'low':
        return colors.success[500];
      default:
        return colors.gray[500];
    }
  };

  const getUrgencyLabel = (urgency) => {
    return urgency.charAt(0).toUpperCase() + urgency.slice(1);
  };

  const handleAccept = async (requestId) => {
    const res = await acceptEmergencyRequest(requestId);

    if (!res?.success) {
      Alert.alert('Error', 'Failed to accept emergency');
      return;
    }

    navigation.replace('EmergencyActiveDoctor', {
      requestId,
    });
  };

  const EmergencyCard = ({ request }) => (
    <Card style={styles.requestCard}>
      {/* Urgency Badge */}
      <View style={styles.urgencyBadge}>
        <View
          style={[
            styles.urgencyIndicator,
            { backgroundColor: getUrgencyColor(request.urgency) },
          ]}
        />
        <Text
          style={[
            styles.urgencyText,
            { color: getUrgencyColor(request.urgency) },
          ]}
        >
          {getUrgencyLabel(request.urgency)} Priority
        </Text>
      </View>

      {/* Patient Info */}
      <View style={styles.patientSection}>
        <Avatar
          source={{ uri: request.patient?.avatar }}
          size={60}
          name={request.patient?.name}
        />
        <View style={styles.patientInfo}>
          <Text style={styles.patientName} numberOfLines={1}>{request.patient?.name || 'Unknown'}</Text>
          <Text style={styles.patientDetails} numberOfLines={1}>
            {request.patient?.age || '-'} years • {request.patient?.gender || '-'}
          </Text>
          <View style={styles.locationRow}>
            <Icon
              name="map-pin"
              size={14}
              color={colors.primary[600]}
              style={{ marginRight: spacing.xs / 2 }}
            />

            <Text style={styles.locationText} numberOfLines={1}>{request.distance} away</Text>
            <Text style={styles.timeText} numberOfLines={1}>• {request.time}</Text>
          </View>
        </View>
      </View>

      {/* Symptoms */}
      <View style={styles.symptomsSection}>
        <Text style={styles.symptomsLabel}>Symptoms:</Text>
        <Text style={styles.symptomsText} numberOfLines={3}>{request.symptoms}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => handleAccept(request.id)}
        >
          <Text style={styles.acceptButtonText}>Accept & Navigate</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Emergency Requests"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        variant="surface"
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <Icon
              name="alert-triangle"
              size={22}
              color={colors.danger[600]}
              style={{ marginRight: spacing.sm }}
            />

            <Text style={styles.infoBannerText}>
              You have {emergencyRequests.length} pending emergency requests nearby
            </Text>
          </View>

          {/* Emergency Requests */}
          {emergencyRequests.length > 0 ? (
            emergencyRequests.map(request => (
              <EmergencyCard key={request.id} request={request} />
            ))
          ) : (
            <EmptyState
              icon={
                <Icon
                  name="alert-triangle"
                  size={48}
                  color={colors.danger[400]}
                />
              }
              title="No Emergency Requests"
              message="There are no emergency requests at the moment"
            />
          )}
        </View>
      </ScrollView>
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
  content: {
    padding: spacing.lg,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger[500],
  },
  infoBannerIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  infoBannerText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.danger[700],
  },
  requestCard: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    ...shadows.md,
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  urgencyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.xs,
  },
  urgencyText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.bold,
    textTransform: 'uppercase',
  },
  patientSection: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  patientInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  patientName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
    flexShrink: 1,
  },
  patientDetails: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginTop: spacing.xs / 2,
    flexShrink: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: spacing.xs / 2,
  },
  locationText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary[600],
    flexShrink: 1,
  },
  timeText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[500],
    marginLeft: spacing.xs,
    flexShrink: 1,
  },
  symptomsSection: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  symptomsLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  symptomsText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[900],
  },
  actionsSection: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.danger[500],
  },
  acceptButton: {
    backgroundColor: colors.success[500],
    ...shadows.sm,
  },
  rejectButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.danger[500],
  },
  acceptButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});

export default EmergencyListScreen;
