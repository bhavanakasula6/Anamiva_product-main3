/**
 * Patient Home Screen
 * Main dashboard for patients
 */

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { usePatient } from '../../contexts/PatientContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';
import { Card, Avatar, Badge, Loading } from '../../components/common';
import Icon from '../../components/Icon';
import { APPOINTMENT_STATUS } from '../../data/constants';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { appointments, activeMedications, notifications, loading } = usePatient();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  useEffect(() => {
    // Filter upcoming appointments using date + time
    const now = new Date();
    const upcoming = appointments
      .filter(apt => {
        if (apt.status !== APPOINTMENT_STATUS.UPCOMING) return false;
        const aptDate = new Date(apt.date);
        if (apt.time) {
          const [hours, minutes] = apt.time.split(':').map(Number);
          aptDate.setHours(hours, minutes, 0, 0);
        }
        return aptDate > now;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 3);
    setUpcomingAppointments(upcoming);
  }, [appointments]);

  if (loading) {
    return <Loading fullScreen text="Loading..." />;
  }

  const QuickActionCard = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Icon name={icon} size={28} color={color} />
      </View>
      <Text style={styles.quickActionText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>
            {user?.firstName || 'Patient'} <Text style={styles.wave}>👋</Text>
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <View style={styles.notificationButton}>
            <Icon name="bell" size={30} color={colors.primary[500]} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickActionCard
            title="Find Doctors"
            icon="doctor"
            color={colors.primary[500]}
            onPress={() => navigation.navigate('DoctorSearch')}
          />
          <QuickActionCard
            title="Emergency"
            icon="alert-triangle"
            color={colors.danger[500]}
            onPress={() => navigation.navigate('EmergencyRequest')}
          />
          <QuickActionCard
            title="My Records"
            icon="file-text"
            color={colors.success[500]}
            onPress={() => navigation.navigate('MedicalRecords')}
          />
          <QuickActionCard
            title="Medications"
            icon="pills"
            color={colors.warning[500]}
            onPress={() => navigation.navigate('Medications')}
          />
        </View>
      </View>

      {/* Upcoming Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {upcomingAppointments.length > 0 ? (
          upcomingAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              style={styles.appointmentCard}
              onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: appointment.id })}
            >
              <View style={styles.appointmentHeader}>
                <Avatar
                  source={{ uri: appointment.doctor?.avatar }}
                  size={50}
                  name={appointment.doctor?.name || 'Doctor'}
                />
                <View style={styles.appointmentInfo}>
                  <Text style={styles.doctorName}>{appointment.doctor?.name || 'Doctor'}</Text>
                  <Text style={styles.doctorSpecialty}>{appointment.doctor?.specialization || appointment.doctor?.speciality || ''}</Text>
                </View>
                <Badge variant="primary" size="sm">
                  {appointment.type}
                </Badge>
              </View>

              <View style={styles.appointmentDetails}>
                <View style={styles.appointmentDetailItem}>
                  <Icon
                    name="calendar"
                    size={16}
                    color={colors.gray[600]}
                    style={{ marginRight: spacing.xs }}
                  />

                  <Text style={styles.detailText}>
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.appointmentDetailItem}>
                  <Icon
                    name="clock"
                    size={16}
                    color={colors.gray[600]}
                    style={{ marginRight: spacing.xs }}
                  />
                  <Text style={styles.detailText}>{appointment.time}</Text>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming appointments</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DoctorSearch')}>
              <Text style={styles.emptyAction}>Book an appointment</Text>
            </TouchableOpacity>
          </Card>
        )}
      </View>

      {/* Active Medications */}
      {activeMedications.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Medications</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Medications')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {activeMedications.slice(0, 3).map((medication) => (
            <Card key={medication.id} style={styles.medicationCard}>
              <View style={styles.medicationHeader}>
                <Icon
                  name="pills"
                  size={24}
                  color={colors.warning[500]}
                  style={{ marginRight: spacing.md }}
                />

                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{medication.name}</Text>
                  <Text style={styles.medicationDosage}>
                    {medication.dosage} • {medication.frequency}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Health Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Tips</Text>
        <Card style={styles.tipCard}>
          <Icon
            name="lightbulb"
            size={50}
            color={colors.warning[500]}
            style={{ marginBottom: spacing.md }}
          />
          <Text style={styles.tipTitle}>Stay Hydrated</Text>
          <Text style={styles.tipText}>
            Drink at least 8 glasses of water daily to maintain good health.
          </Text>
        </Card>
      </View>

        <View style={styles.bottomPadding} />
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
    position: 'relative',
    padding: spacing.sm,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: colors.danger[500],
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: colors.white,
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.bold,
  },
  section: {
    padding: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  seeAllText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary[500],
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: colors.surface.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  quickActionEmoji: {
    fontSize: 30,
  },
  quickActionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[700],
    textAlign: 'center',
  },
  appointmentCard: {
    marginBottom: spacing.md,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  doctorName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[900],
  },
  doctorSpecialty: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginTop: spacing.xs / 2,
  },
  appointmentDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  appointmentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[700],
  },
  emptyCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  emptyAction: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary[500],
  },
  medicationCard: {
    marginBottom: spacing.sm,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[900],
  },
  medicationDosage: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    marginTop: spacing.xs / 2,
  },
  tipCard: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  tipIcon: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  tipTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  tipText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
    textAlign: 'center',
  },
  bottomPadding: {
    height: spacing.xl,
  },
});

export default HomeScreen;
