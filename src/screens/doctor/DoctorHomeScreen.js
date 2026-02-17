/**
 * Doctor Home Screen
 * Main dashboard for doctors with modern UI
 */

import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Badge, Card, IconButton, Loading } from '../../components/common';
import Icon from '../../components/Icon';
import { useAuth } from '../../contexts/AuthContext';
import { useDoctor } from '../../contexts/DoctorContext';
import { APPOINTMENT_STATUS, APPOINTMENT_TYPES } from '../../data/constants';
import theme from '../../styles/theme';
const { colors, typography, spacing, borderRadius, shadows } = theme;

const DoctorHomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { appointments, analytics, loading } = useDoctor();
  const APPOINTMENT_TYPE_LABELS = {
    online: 'Online',
    'in-person': 'In Person',
  };
  const ALLOWED_TODAY_STATUSES = [
    APPOINTMENT_STATUS.PENDING,
    APPOINTMENT_STATUS.UPCOMING,
  ];

  const STATUS_BADGE_CONFIG = {
    [APPOINTMENT_STATUS.PENDING]: {
      label: 'Pending',
      variant: 'warning',
    },
    [APPOINTMENT_STATUS.UPCOMING]: {
      label: 'Upcoming',
      variant: 'success',
    },
  };

  const todayAppointments = useMemo(() => {
    const today = new Date().toDateString();

    return appointments.filter(apt => {
      const isToday =
        new Date(apt.date).toDateString() === today;

      const isAllowedStatus =
        ALLOWED_TODAY_STATUSES.includes(apt.status);

      return isToday && isAllowedStatus;
    });
  }, [appointments]);

  if (loading) {
    return <Loading fullScreen />;
  }

  const uniqueTodayPatients = new Set(
    todayAppointments.map(a => a.patient?.id)
  ).size;

  const revenue = analytics?.today?.revenue ?? 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Back,</Text>
            <Text style={styles.userName}>
              {user?.fullName || 'Doctor'}
            </Text>

          </View>
          <IconButton
            icon="bell"
            onPress={() => navigation.navigate('Notifications')}
            color="primary"
            size={55}
          />

        </View>

        {/* Today's Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Appointments"
              value={`₹${revenue.toLocaleString('en-IN')}`}
              icon="calendar"
              color={colors.primary[500]}
            />
            <StatCard
              title="Patients"
              value={uniqueTodayPatients}
              icon="users"
              color={colors.success[500]}
            />
            <StatCard
              title="Revenue"
              value={`₹${analytics?.today?.revenue || 0}`}
              icon="wallet"
              color={colors.warning[500]}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('DoctorAppointmentsList')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary[50] }]}>
                <Icon name="calendar" size={28} color={colors.primary[500]} />
              </View>
              <Text style={styles.actionText}>Appointments</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('EmergencyList')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.danger[50] }]}>
                <Icon name="alert-triangle" size={28} color={colors.danger[500]} />
              </View>
              <Text style={styles.actionText}>Emergency</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('AnalyticsMain')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.success[50] }]}>
                <Icon name="bar-chart" size={28} color={colors.success[500]} />
              </View>
              <Text style={styles.actionText}>Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('AllPatientRecords')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.warning[50] }]}>
                <Icon name="file-text" size={28} color={colors.warning[500]} />
              </View>
              <Text style={styles.actionText}>Patient Records</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('DoctorRecordVerification')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.warning[50] }]}>
                <Icon name="check-square" size={28} color={colors.warning[500]} />
              </View>
              <Text style={styles.actionText}>Verify Records</Text>
            </TouchableOpacity>

          </View>
        </View>

        {/* Today's Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DoctorAppointmentsList')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {todayAppointments.length > 0 ? (
            todayAppointments.slice(0, 3).map((appointment, index) => (
              <Card
                key={appointment.id || `apt-${index}`}
                style={styles.appointmentCard}
                onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: appointment.id })}
              >
                <View style={styles.appointmentHeader}>
                  <Avatar
                    source={{ uri: appointment.patient?.avatar }}
                    size={50}
                    name={appointment.patient?.name}
                  />
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.patientName}>{appointment.patient?.name || 'Unknown Patient'}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon
                        name="clock"
                        size={14}
                        color={colors.gray[600]}
                        style={{ marginRight: spacing.xs }}
                      />
                      <Text style={styles.appointmentTime}>{appointment.time}</Text>
                    </View>
                    <View style={styles.joinCallContainer}>
                      {appointment.type === APPOINTMENT_TYPES.ONLINE &&
                        appointment.status === APPOINTMENT_STATUS.UPCOMING &&
                        appointment.videoCallLink && (
                          <TouchableOpacity onPress={() =>
                            navigation.navigate('VideoCall', {
                              url: appointment.videoCallLink,
                              appointmentId: appointment.id,
                            })
                          }>
                            <View style={styles.joinCallContainer}>
                              <Icon name="video" size={14} color={colors.primary[500]} style={{ marginRight: spacing.xs }} />
                              <Text style={styles.joinCallText}>Join Call</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                    </View>
                  </View>

                  <View style={styles.badgeColumn}>
                    <Badge
                      variant={STATUS_BADGE_CONFIG[appointment.status]?.variant}
                      size="sm"
                    >
                      {STATUS_BADGE_CONFIG[appointment.status]?.label}
                    </Badge>

                    <Badge variant="neutral" size="sm">
                      {APPOINTMENT_TYPE_LABELS[appointment.type]}
                    </Badge>
                  </View>

                </View>
              </Card>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyText}>No appointments today</Text>
            </Card>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

//Inner components

const StatCard = ({ title, value, icon, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={styles.statIconWrapper}>
      <Icon name={icon} size={32} color={color} />
    </View>
    <View style={styles.statInfo}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{title}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface.app
  },
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.white,
    borderBottomLeftRadius: borderRadius['2xl'],
    borderBottomRightRadius: borderRadius['2xl'],
    ...shadows.sm,
  },
  badgeColumn: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  joinCallContainer: {
    marginTop: spacing[1],
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinCallText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary[500],
  },
  greeting: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
  },
  userName: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
    marginTop: spacing.xs,
  },
  notificationButton: {
    padding: spacing.sm,
  },
  notificationIcon: {
    fontSize: 24,
  },
  statsSection: {
    padding: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  statsGrid: {
    gap: spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    ...shadows.sm,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginTop: 2,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary[500],
  },
  statIconWrapper: {
    marginRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionEmoji: {
    fontSize: 30,
  },
  actionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[700],
  },
  appointmentCard: {
    marginBottom: spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  patientName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[900],
  },
  appointmentTime: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
  },
  bottomPadding: {
    height: spacing.xl,
  },
});

export default DoctorHomeScreen;
