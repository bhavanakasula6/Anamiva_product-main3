/**
 * Record Details Screen
 * Shared between Patient & Doctor
 */

import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDoctor } from '../../contexts/DoctorContext';
import { usePatient } from '../../contexts/PatientContext';

import {
  Card,
  EmptyState,
  Header,
  Loading,
} from '../../components/common';

import Icon from '../../components/Icon';

import {
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from '../../styles/theme';

const RecordDetailsScreen = ({ route, navigation }) => {
  const { recordId, patientId, mode, record: passedRecord } = route.params;
  const isPatientView = mode === 'PATIENT';

  const { medicalRecords, loadMedicalRecords } = usePatient();
  const { getPatientMedicalRecords } = useDoctor();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadRecord();
    }, [recordId])
  );

  const loadRecord = async () => {
    setLoading(true);

    // 🟢 Doctor verification mode → record already provided
    if (mode === 'DOCTOR_VERIFY' && passedRecord) {
      setRecord(passedRecord);
      setLoading(false);
      return;
    }

    // 🟢 Patient view
    if (isPatientView) {
      if (!medicalRecords.length) {
        await loadMedicalRecords();
      }
      const found = medicalRecords.find(r => (r._id || r.id) === recordId);
      setRecord(found || null);
      setLoading(false);
      return;
    }

    // 🟢 Doctor viewing verified records
    const response = await getPatientMedicalRecords(patientId);
    if (response?.success) {
      const found = response.records.find(r => (r._id || r.id) === recordId);
      setRecord(found || null);
    }

    setLoading(false);
  };

  if (loading) {
    return <Loading fullScreen text="Loading record..." />;
  }

  if (!record) {
    return (
      <EmptyState
        title="Record Not Found"
        description="The requested medical record could not be found."
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Medical Record"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER CARD */}
        <Card style={styles.headerCard}>
          <Text style={styles.title}>{record.title}</Text>

          <View style={styles.metaRow}>
            <Icon
              name="calendar"
              size={14}
              color={colors.gray[500]}
            />
            <Text style={styles.metaText}>
              {new Date(record.date || record.createdAt).toDateString()}
            </Text>
          </View>
        </Card>

        {/* DIAGNOSIS */}
        {record.diagnosis && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Diagnosis</Text>
            <Text style={styles.bodyText}>
              {record.diagnosis}
            </Text>
          </Card>
        )}

        {/* MEDICATIONS */}
        {record.medications?.length > 0 && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Medications</Text>

            {record.medications.map(med => (
              <View key={med.id} style={styles.medItem}>
                <View style={styles.medHeader}>
                  <Icon
                    name="pills"
                    size={16}
                    color={colors.primary[500]}
                  />
                  <Text style={styles.medName}>
                    {med.name}
                  </Text>
                </View>

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

        {/* DOCTOR VIEW NOTICE */}
        {mode === 'DOCTOR_VERIFY' && (
          <View style={styles.noticeBox}>
            <Icon name="alert-circle" size={16} color={colors.warning[500]} />
            <Text style={styles.noticeText}>
              Pending verification · Doctor review required
            </Text>
          </View>
        )}
        {mode === 'DOCTOR' && (
          <View style={styles.noticeBox}>
            <Icon name="lock" size={16} color={colors.gray[500]} />
            <Text style={styles.noticeText}>
              View-only access · Shared by patient
            </Text>
          </View>
        )}

        <View style={{ height: spacing.xl }} />
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
    padding: spacing.lg,
  },

  headerCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  title: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },

  metaText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[500],
  },

  sectionCard: {
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },

  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },

  bodyText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },

  medItem: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    marginBottom: spacing.sm,
  },

  medHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  medName: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[900],
  },

  medSub: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
    marginTop: 2,
  },

  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
  },

  noticeText: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[600],
  },
});

export default RecordDetailsScreen;
