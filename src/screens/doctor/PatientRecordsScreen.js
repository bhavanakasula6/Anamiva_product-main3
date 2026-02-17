/**
 * Patient Records Screen (Doctor View)
 * Access-controlled medical records
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useDoctor } from '../../contexts/DoctorContext';

import { Card, EmptyState, Loading, Button, Header } from '../../components/common';
import { colors, spacing, typography, shadows } from '../../styles/theme';
import { ACCESS_STATUS } from '../../data/constants';
import Icon from '../../components/Icon';

const PatientRecordsScreen = ({ route, navigation }) => {
  const { patientId, patientName, appointmentId , requestId} = route.params;

  const {
    getPatientMedicalRecords,
    getAccessStatus,
    requestAccess,
    cancelAccessRequest,
  } = useDoctor();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState({ status: ACCESS_STATUS.NO_ACCESS, type: null });
  const accessState = access.status;
  const consentType = access.type;

  useFocusEffect(
    React.useCallback(() => {
      validateAndLoad();
    }, [patientId])
  );

  const validateAndLoad = async () => {
    setLoading(true);

    const resolved = await getAccessStatus({
      patientId,
      appointmentId,
    });

    setAccess(resolved);

    if (resolved.status === ACCESS_STATUS.GRANTED) {
      const response = await getPatientMedicalRecords(patientId);
      setRecords(response?.success ? response.records : []);
    } else {
      setRecords([]);
    }

    setLoading(false);
  };

  const handleRequestAccess = async () => {
    const res = await requestAccess({
      patientId,
      appointmentId,
    });

    if (res?.success) {
      alert('Access request sent to patient');
      navigation.goBack();
      return;
    }
    switch (res?.error) {
      case 'ACCESS_ALREADY_GRANTED':
        alert('You already have access to this patient’s records.');
        break;
      case 'DUPLICATE_PENDING_REQUEST':
        alert('An access request is already pending.');
        break;
      case 'APPOINTMENT_NOT_UPCOMING':
        alert('Access can only be requested for upcoming appointments.');
        break;
      default:
        alert('Unable to request access at this time.');
    }
  };

  const handleCancelRequest = async () => {
    await cancelAccessRequest(requestId);

    navigation.goBack();
  };


  const renderBanner = () => {
    switch (accessState) {
      case ACCESS_STATUS.PENDING:
        return (
          <View style={styles.bannerPending}>
            <Text style={styles.bannerText}>
              <Icon name="clock" size={15}/>  Access request pending for patient approval
            </Text>

            <Button
              size="sm"
              variant="outline"
              onPress={handleCancelRequest}
            >
              Cancel Request
            </Button>
          </View>
        );


      case ACCESS_STATUS.DENIED:
        return (
          <View style={styles.bannerDenied}>
            <Text style={styles.bannerText}>
              <Icon name="close" size={15}/>  Patient denied access to medical history
            </Text>
            <Text style={styles.disclaimer}>
              You cannot view records unless the patient shares access again.
            </Text>
          </View>
        );
      case ACCESS_STATUS.GRANTED:
        return (
          <View style={styles.bannerGranted}>
            <Text style={styles.bannerText}>
              <Icon name="unlock" size={15}/>  {consentType === 'consultation'
                ? 'Consultation-only access (expires after consultation)'
                : 'Extended access (patient shared)'}
            </Text>
            <Text style={styles.disclaimer}>
              Shared for diagnosis & treatment only
            </Text>
          </View>
        );

      case ACCESS_STATUS.NO_ACCESS:
      default:
        return (
          <View style={styles.bannerDefault}>
            <Text style={styles.bannerText}>
               <Icon name="lock" size={15}/> No access to medical history
            </Text>

            {appointmentId && (
              <Button size="sm" onPress={handleRequestAccess}>
                Request Consultation Access
              </Button>
            )}
          </View>
        );
    }
  };


  const renderRecord = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate('RecordDetails', {
          recordId: item.id,
          patientId,
          mode: 'DOCTOR',
        })
      }
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.sub}>
        {new Date(item.date).toDateString()}
      </Text>
      <Text style={styles.badge}>{item.status}</Text>
    </Card>
  );

  if (loading) {
    return <Loading fullScreen text="Loading medical records..." />;
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={patientName}
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>

        {renderBanner()}

        {accessState === ACCESS_STATUS.GRANTED && (
          <FlatList
            data={records}
            keyExtractor={item => item.id}
            renderItem={renderRecord}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                title="No Records"
                description="No medical records available"
              />
            }
          />

        )}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },

  header: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.sm,
  },
  title: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[900],
  },
  sub: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: 4,
  },
  badge: {
    marginTop: 6,
    fontSize: typography.fontSize.xs,
    color: colors.primary[600],
    textTransform: 'uppercase',
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  bannerGranted: {
    padding: spacing.sm,
    backgroundColor: colors.success[50],
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  bannerPending: {
    padding: spacing.sm,
    backgroundColor: colors.warning[50],
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  bannerDenied: {
    padding: spacing.sm,
    backgroundColor: colors.danger[50],
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  bannerDefault: {
    padding: spacing.sm,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  bannerText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[800],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  disclaimer: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
    textAlign: 'center',
  },
});

export default PatientRecordsScreen;
