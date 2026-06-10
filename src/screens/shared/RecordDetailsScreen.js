/**
 * Record Details Screen
 * Shared between Patient & Doctor
 */

import { useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDoctor } from '../../contexts/DoctorContext';
import { usePatient } from '../../contexts/PatientContext';

import {
  Button,
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
  const { getPatientMedicalRecords, updatePrescription, verifyRecord } = useDoctor();

  const [record, setRecord] = useState(null);
  const [recordDateText, setRecordDateText] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingDate, setSavingDate] = useState(false);
  const [verifying, setVerifying] = useState(false);

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
      setRecordDateText(
        new Date(passedRecord.recordDate || passedRecord.date || passedRecord.createdAt)
          .toISOString()
          .slice(0, 10)
      );
      setLoading(false);
      return;
    }

    // 🟢 Patient view
    if (isPatientView) {
      const response = await loadMedicalRecords();
      const latestRecords = response?.success ? response.records : medicalRecords;
      const found = latestRecords.find(r => (r._id || r.id) === recordId);
      setRecord(found || null);
      if (found) {
        setRecordDateText(
          new Date(found.recordDate || found.date || found.createdAt).toISOString().slice(0, 10)
        );
      }
      setLoading(false);
      return;
    }

    // 🟢 Doctor viewing verified records
    const response = await getPatientMedicalRecords(patientId);
    if (response?.success) {
      const found = response.records.find(r => (r._id || r.id) === recordId);
      setRecord(found || null);
      if (found) {
        setRecordDateText(
          new Date(found.recordDate || found.date || found.createdAt).toISOString().slice(0, 10)
        );
      }
    }

    setLoading(false);
  };

  const handleSaveDate = async () => {
    if (Number.isNaN(new Date(recordDateText).getTime())) {
      Alert.alert('Invalid date', 'Please enter date in YYYY-MM-DD format');
      return;
    }

    setSavingDate(true);
    const response = await updatePrescription(record.id || record._id, {
      recordDate: recordDateText,
    });
    setSavingDate(false);

    if (response?.success) {
      setRecord(response.record);
      Alert.alert('Saved', 'Record date updated');
      return;
    }

    Alert.alert('Error', 'Failed to update record date');
  };

  const handleVerify = async () => {
    setVerifying(true);
    const response = await verifyRecord(record.id || record._id);
    setVerifying(false);

    if (response?.success) {
      setRecord(response.record);
      navigation.goBack();
      return;
    }

    Alert.alert('Error', 'Failed to verify record');
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
              {new Date(record.recordDate || record.date || record.createdAt).toDateString()}
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

            {record.medications.map((med, index) => (
              <View key={med.id || med._id || `${med.name}-${index}`} style={styles.medItem}>
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

        {mode === 'DOCTOR_VERIFY' && (
          <Card style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Verification</Text>
            <TextInput
              style={styles.input}
              value={recordDateText}
              onChangeText={setRecordDateText}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.gray[400]}
              keyboardType="numbers-and-punctuation"
            />
            <View style={styles.actionRow}>
              <Button
                variant="outline"
                onPress={handleSaveDate}
                loading={savingDate}
                disabled={savingDate || verifying}
              >
                Save Date
              </Button>
              <Button
                onPress={handleVerify}
                loading={verifying}
                disabled={savingDate || verifying}
              >
                Verify
              </Button>
            </View>
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

  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
});

export default RecordDetailsScreen;
