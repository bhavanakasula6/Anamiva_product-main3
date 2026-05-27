/**
 * Appointment Details Screen
 * Shared by Patient & Doctor
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import { usePatient } from '../../contexts/PatientContext';
import { useDoctor } from '../../contexts/DoctorContext';

import {
  Card,
  Button,
  Loading,
  Badge,
  Header,
} from '../../components/common';
import Icon from '../../components/Icon';

import { colors, spacing, typography, shadows } from '../../styles/theme';
import {
  ACCESS_REQUEST_STATUS,
  ACCESS_STATUS,
  APPOINTMENT_STATUS,
  CALL_STATUS,
} from '../../data/constants';
import { appointmentAPI } from '../../services/api';

const AppointmentDetailsScreen = ({ route, navigation }) => {
  const { appointmentId, refresh } = route.params;
  const { user } = useAuth();

  if (!user) {
    return <Loading fullScreen text="Signing out..." />;
  }

  const role = user.role;
  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';

  const {
    checkConsent,
    accessStatus,
    activeConsent,
    shareConsultationRecords,
    revokeConsent,
    requests,
    approveRequest,
    denyRequest,
    loadRequests,
  } = usePatient();

  const {
    updateAppointmentStatus,
    getPatientAccessStatus,
    requestAccess,
    getAppointmentPrescription,
  } = useDoctor();

  const [loading, setLoading] = useState(true);
  const [doctorAccessStatus, setDoctorAccessStatus] = useState({ status: 'NO_ACCESS', type: null });
  const [appointment, setAppointment] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [showAccess, setShowAccess] = useState(isDoctor);

  const isCompleted = appointment?.status === APPOINTMENT_STATUS.COMPLETED;
  const isCancelled = appointment?.status === APPOINTMENT_STATUS.CANCELLED;
  const isUpcoming = appointment?.status === APPOINTMENT_STATUS.UPCOMING;
  const isPending = appointment?.status === APPOINTMENT_STATUS.PENDING;

  const loadAppointment = async () => {
    const res = await appointmentAPI.getAppointmentById(appointmentId);
    if (res.success) {
      setAppointment(res.appointment);
    } else {
      Alert.alert('Error', 'Appointment not found');
      navigation.goBack();
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadAppointment();
      if (isPatient) {
        await Promise.all([
          checkConsent(appointmentId),
          loadRequests(),
        ]);
      }
      setLoading(false);
    })();
  }, [appointmentId, refresh]);

  useEffect(() => {
    if (!isDoctor || !appointment?.id) return;

    (async () => {
      const res = await getAppointmentPrescription(appointment.id);
      if (res?.success) {
        setPrescription(res.prescription);
        if (res.prescription && !appointment.prescriptionId) {
          setAppointment(prev => ({
            ...prev,
            prescriptionId: res.prescription.id,
          }));
        }
      }
    })();
  }, [appointment?.id, isDoctor]);

  useEffect(() => {
    if (!isDoctor || !appointment || isCancelled || isCompleted) return;

    (async () => {
      const status = await getPatientAccessStatus({
        patientId: appointment.patientId,
        appointmentId: appointment.id,
      });
      setDoctorAccessStatus(status);
    })();
  }, [appointment?.id, appointment?.status, isDoctor]);

  const doctorRequest = useMemo(() => {
    if (!isPatient || !appointment) return null;

    return requests.find(
      r =>
        r.doctorId === appointment.doctorId &&
        r.appointmentId === appointment.id &&
        r.status === ACCESS_REQUEST_STATUS.PENDING
    );
  }, [requests, appointment, isPatient]);

  const shareAccess = async () => {
    await shareConsultationRecords(
      appointment.doctorId,
      appointment.id
    );
    await checkConsent(appointment.id);
  };

  const revokeAccess = () => {
    Alert.alert(
      'Revoke Consultation Access?',
      'Doctor will immediately lose access to consultation records.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: async () => {
            if (!activeConsent?.id) return;
            await revokeConsent({ consentId: activeConsent.id });
            await checkConsent(appointmentId);
          },
        },
      ]
    );
  };

  const confirmAppointment = async () => {
    if (appointment.status !== APPOINTMENT_STATUS.PENDING) return;
    const res = await updateAppointmentStatus(
      appointment.id,
      APPOINTMENT_STATUS.UPCOMING
    );
    if (res?.success) {
      setAppointment(res.appointment);
      await checkConsent(appointment.id);
    }
  };

  const completeConsultation = () => {
    Alert.alert(
      'Complete Consultation?',
      'This will close the consultation and revoke consultation record access.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            const res = await updateAppointmentStatus(
              appointment.id,
              APPOINTMENT_STATUS.COMPLETED
            );
            if (res?.success) {
              setAppointment(res.appointment); // 🔑
              await checkConsent(appointment.id);
            }
          },
        },
      ]
    );
  };

  const cancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment?',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const res = await updateAppointmentStatus(
              appointment.id,
              APPOINTMENT_STATUS.CANCELLED
            );
            if (res?.success) {
              setAppointment(res.appointment);
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  const requestDoctorAccess = async () => {
    if (!isUpcoming) {
      Alert.alert('Access unavailable', 'Consultation is not active');
      return;
    }

    const res = await requestAccess({
      patientId: appointment.patientId,
      appointmentId: appointment.id,
    });

    if (!res?.success) {
      switch (res?.error) {
        case 'ACCESS_ALREADY_GRANTED':
          Alert.alert('Access already granted');
          break;
        case 'DUPLICATE_PENDING_REQUEST':
          Alert.alert('Access request already pending');
          break;
        case 'ACCESS_DENIED_BY_PATIENT':
          Alert.alert('Patient denied access');
          break;
        default:
          Alert.alert('Unable to request access');
      }
      return;
    }

    // Optimistic update + user feedback
    setDoctorAccessStatus({ status: 'PENDING' });
    Alert.alert('Request Sent', 'Your consultation access request has been sent to the patient.');
  };

  if (loading || !appointment) {
    return <Loading fullScreen text="Loading appointment..." />;
  }
  const canViewPrescription =
    !!prescription &&
    (isDoctor || (isPatient && isCompleted));


  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Appointment Details"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
        variant="surface"
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>

          {/* Appointment Info */}
          <Card style={styles.card}>
            <View style={styles.titleRow}>
              <Icon name="calendar" size={18} color={colors.primary[500]} />
              <Text style={styles.title}>Appointment</Text>
            </View>

            <View style={styles.metaRow}>
              <Icon name="clock" size={14} color={colors.gray[500]} />
              <Text style={styles.meta}>
                {new Date(appointment.date).toDateString()} · {appointment.time}
              </Text>
            </View>

            <View style={styles.idRow}>
              <Text style={styles.idLabel}>Appointment ID : </Text>
              <Text selectable style={styles.idValue}>
                {appointment.id}
              </Text>
            </View>

            <Badge
              size="sm"
              variant={
                appointment.status === APPOINTMENT_STATUS.PENDING
                  ? 'warning'
                  : appointment.status === APPOINTMENT_STATUS.UPCOMING
                    ? 'primary'
                    : appointment.status === APPOINTMENT_STATUS.COMPLETED
                      ? 'success'
                      : 'gray'
              }
            >
              {appointment.status}
            </Badge>

          </Card>

          {/* Prescription (Patients can only view after consultation is completed) */}
          {canViewPrescription && (
            <Card style={styles.card}>
              <Text style={styles.section}>Prescription</Text>

              {prescription?.medications?.map((med, i) => (
                <View key={i} style={styles.prescriptionItem}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.medSub}>
                    {med.dosage} · {med.frequency}
                  </Text>
                  <Text style={styles.medSub}>
                    Duration: {med.duration}
                  </Text>
                </View>
              ))}
            </Card>
          )}

          {/* Access Control */}
          <Card style={styles.card}>
            <TouchableOpacity
              onPress={() => setShowAccess(v => !v)}
            >
              <Text style={styles.section}>Consultation Record Access {showAccess ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>
            {showAccess && (
              <>
                {isPatient && (
                  <>
                    {isPending && (
                      <View style={styles.accessRow}>
                        <Icon name="progress" size={14} color={colors.gray[500]} />
                        <Text style={styles.accessMuted}>
                          Access available after doctor accepts appointment
                        </Text>
                      </View>
                    )}

                    {accessStatus?.status === ACCESS_STATUS.GRANTED && isUpcoming && (
                      <>
                        <View style={styles.accessRow}>
                          <Icon name="unlock" size={14} color={colors.success[600]} />
                          <Text style={styles.accessGranted}>
                            Consultation access granted
                          </Text>
                        </View>
                        <Button variant="danger" onPress={revokeAccess}>
                          Revoke Access
                        </Button>
                      </>
                    )}

                    {accessStatus?.status === ACCESS_STATUS.PENDING && isUpcoming && doctorRequest && (
                      <>
                        <View style={styles.accessRow}>
                          <Icon name="timer" size={14} color={colors.success[600]} />
                          <Text style={styles.accessPending}>
                            Doctor requested access
                          </Text>
                        </View>

                        <Button
                          onPress={async () => {
                            await approveRequest(doctorRequest);
                            await loadRequests();
                            await checkConsent(appointment.id);
                            Alert.alert('Access Granted', 'Doctor now has access to your consultation records.');
                          }}
                        >
                          Approve Request
                        </Button>

                        <Button
                          variant="danger"
                          onPress={async () => {
                            await denyRequest(doctorRequest);
                            await loadRequests();

                            Alert.alert(
                              'Access Denied',
                              'You denied the doctor\'s consultation access request.'
                            );
                          }}
                        >
                          Deny Request
                        </Button>
                      </>
                    )}

                    {accessStatus?.status === ACCESS_STATUS.NO_ACCESS && isUpcoming && (
                      <>
                        <View style={styles.accessRow}>
                          <Icon name="lock" size={14} color={colors.gray[500]} />
                          <Text style={styles.accessMuted}>Not shared</Text>
                        </View>
                        <Button
                          onPress={shareAccess}
                        >
                          Share Consultation Records
                        </Button>
                      </>
                    )}

                    {isCompleted && (
                      <View style={styles.accessRow}>
                        <Icon name="clock" size={14} color={colors.success[600]} />
                        <Text style={styles.accessDenied}>
                          Consultation completed — access expired
                        </Text>
                      </View>
                    )}

                    {isCancelled && (
                      <View style={styles.accessRow}>
                        <Icon name="close" size={14} color={colors.success[600]} />
                        <Text style={styles.accessDenied}>
                          Appointment cancelled — records were not shared
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {isDoctor && (
                  <>
                    {isPending && (
                      <Text style={styles.accessDenied}>
                        <Icon name="clock" size={14} color={colors.success[600]} /> Appointment not yet accepted — access unavailable
                      </Text>
                    )}
                    {doctorAccessStatus?.status === ACCESS_STATUS.GRANTED && isUpcoming && (
                      <View style={styles.accessRow}>
                        <Icon name="unlock" size={14} color={colors.success[600]} />
                        <Text style={styles.accessGranted}>
                          Consultation-only access granted
                        </Text>
                      </View>
                    )}

                    {doctorAccessStatus?.status === ACCESS_STATUS.PENDING && isUpcoming && (
                      <View style={styles.accessRow}>
                        <Icon name="progress" size={14} color={colors.success[600]} />
                        <Text style={styles.accessPending}>
                          Access request pending
                        </Text>
                      </View>
                    )}

                    {doctorAccessStatus?.status === ACCESS_STATUS.NO_ACCESS && isUpcoming && (
                      <>
                        <View style={styles.accessRow}>
                          <Icon name="lock" size={14} color={colors.gray[500]} />
                          <Text style={styles.accessMuted}>No access</Text>
                        </View>
                        <Button onPress={requestDoctorAccess}>
                          Request Consultation Access
                        </Button>
                      </>
                    )}

                    {isCompleted && (
                      <View style={styles.accessRow}>
                        <Icon name="clock" size={14} color={colors.primary[500]} />
                        <Text style={styles.accessMuted}>Consultation completed — history access expired
                        </Text>
                      </View>
                    )}

                    {isCancelled && (
                      <View style={styles.accessRow}>
                        <Icon name="close" size={14} color={colors.gray[500]} />
                        <Text style={styles.accessMuted}>Appointment cancelled — no access to patient medical history
                        </Text>
                      </View>
                    )}
                    {doctorAccessStatus?.status === ACCESS_STATUS.DENIED && isUpcoming && (
                      <View style={styles.accessRow}>
                        <Icon name="close" size={14} color={colors.gray[500]} />
                        <Text style={styles.accessMuted}>Patient denied access to consultation records
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </>
            )}
          </Card>

          {/* Video Call */}
          {appointment.type === 'online' && !isCancelled && (
            <Card style={styles.card}>
              <View style={styles.titleRow}>
                <Icon name="video" size={18} color={colors.primary[500]} />
                <Text style={styles.title}>Video Call</Text>
              </View>

              {isDoctor && isUpcoming && (
                <>
                  {(!appointment.callStatus || appointment.callStatus === CALL_STATUS.IDLE) && (
                    <Button
                      variant="primary"
                      onPress={async () => {
                        try {
                          const res = await appointmentAPI.startCall(appointment.id);
                          if (res.success) {
                            setAppointment(res.appointment);
                            navigation.navigate('VideoCall', {
                              appointmentId: appointment.id,
                              roomId: res.appointment.videoCallRoomId,
                              isCaller: true,
                              otherPartyName: appointment.patient?.name || 'Patient',
                            });
                          }
                        } catch (err) {
                          Alert.alert('Error', 'Failed to start call');
                        }
                      }}
                    >
                      Start Video Call
                    </Button>
                  )}

                  {(appointment.callStatus === CALL_STATUS.RINGING || appointment.callStatus === CALL_STATUS.IN_PROGRESS) && (
                    <>
                      <Text style={styles.accessMuted}>
                        {appointment.callStatus === CALL_STATUS.RINGING ? 'Waiting for patient...' : 'Call in progress'}
                      </Text>
                      <Button
                        variant="primary"
                        onPress={() => {
                          navigation.navigate('VideoCall', {
                            appointmentId: appointment.id,
                            roomId: appointment.videoCallRoomId,
                            isCaller: true,
                            otherPartyName: appointment.patient?.name || 'Patient',
                          });
                        }}
                      >
                        Rejoin Call
                      </Button>
                    </>
                  )}
                </>
              )}

              {isPatient && isUpcoming && (
                <>
                  {(!appointment.callStatus || appointment.callStatus === CALL_STATUS.IDLE) && (
                    <Text style={styles.accessMuted}>Doctor will start the call when ready</Text>
                  )}

                  {(appointment.callStatus === CALL_STATUS.RINGING || appointment.callStatus === CALL_STATUS.IN_PROGRESS) && (
                    <Button
                      variant="success"
                      onPress={async () => {
                        try {
                          const res = await appointmentAPI.joinCall(appointment.id);
                          if (res.success) {
                            navigation.navigate('VideoCall', {
                              appointmentId: appointment.id,
                              roomId: res.videoCallRoomId,
                              isCaller: false,
                              otherPartyName: appointment.doctor?.name || 'Doctor',
                            });
                          }
                        } catch (err) {
                          Alert.alert('Error', 'Failed to join call');
                        }
                      }}
                    >
                      Join Video Call
                    </Button>
                  )}
                </>
              )}

              {appointment.callStatus === CALL_STATUS.ENDED && (
                <View style={styles.accessRow}>
                  <Icon name="check" size={14} color={colors.success[600]} />
                  <Text style={styles.accessGranted}>
                    Call completed
                    {appointment.callStartedAt && appointment.callEndedAt && (
                      ` (${Math.round((new Date(appointment.callEndedAt) - new Date(appointment.callStartedAt)) / 60000)} min)`
                    )}
                  </Text>
                </View>
              )}
            </Card>
          )}

          {/* Doctor Actions */}
          {isDoctor && !isCancelled && !isCompleted && (
            <Card style={styles.card}>
              <Text style={styles.section}>Doctor Actions</Text>

              {isPending && (
                <Button onPress={confirmAppointment}>
                  Accept Appointment
                </Button>
              )}

              {isUpcoming && (
                <Button
                  variant="primary"
                  onPress={() => {
                    if (appointment.status !== APPOINTMENT_STATUS.UPCOMING) {
                      Alert.alert(
                        'Prescription locked',
                        'Prescription cannot be modified after consultation completion'
                      );
                      return;
                    }
                    navigation.navigate('PrescriptionForm', {
                      appointmentId: appointment.id,
                      appointmentStatus: appointment.status,
                    });
                  }}
                >
                  {appointment.prescriptionId ? 'Edit Prescription' : 'Create Prescription'}
                </Button>
              )}

              {isUpcoming && (
                <Button variant="success" onPress={completeConsultation}>
                  Complete Consultation
                </Button>
              )}
              {isPending && (
                <Button variant="danger" onPress={cancelAppointment}>
                  Cancel Appointment
                </Button>
              )}
            </Card>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  scrollView: { flex: 1, backgroundColor: colors.gray[50] },
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.gray[50] },
  card: { marginBottom: spacing.md, padding: spacing.lg, ...shadows.sm, gap: spacing.sm },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  idRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  idLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },

  idValue: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.mono || typography.fontFamily.medium,
    color: colors.gray[800],
  },


  accessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },

  title: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },

  meta: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },

  section: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
  },

  accessGranted: {
    color: colors.success[600],
    fontSize: typography.fontSize.sm,
  },

  accessPending: {
    color: colors.warning[600],
    fontSize: typography.fontSize.sm,
  },

  accessDenied: {
    color: colors.danger[500],
    fontSize: typography.fontSize.sm,
  },

  accessMuted: {
    color: colors.gray[500],
    fontSize: typography.fontSize.sm,
  },

  prescriptionItem: {
    backgroundColor: colors.gray[100],
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  medName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
  },
  medSub: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },

});

export default AppointmentDetailsScreen;
