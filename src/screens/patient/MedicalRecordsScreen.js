/**
 * Medical Records Screen
 * View and upload medical records
 */

import { useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePatient } from '../../contexts/PatientContext';

import {
  colors,
  shadows,
  spacing,
  typography,
} from '../../styles/theme';

import {
  Badge,
  Card,
  EmptyState,
  Header,
  Loading
} from '../../components/common';

import Icon from '../../components/Icon';

const MedicalRecordsScreen = ({ navigation }) => {
  const { medicalRecords, loadMedicalRecords, loading } = usePatient();

  useEffect(() => {
    loadMedicalRecords();
  }, []);

  const getRecordIcon = (type) => {
    switch (type) {
      case 'prescription':
        return 'pills';
      case 'lab-report':
        return 'file-text';
      default:
        return 'file';
    }
  };

  const RecordCard = ({ record }) => (
    <Card
      style={styles.recordCard}
      onPress={() =>
        navigation.navigate('RecordDetails', {
          recordId: record._id || record.id,
          mode: 'PATIENT',
        })
      }
    >
      <View style={styles.recordHeader}>
        <View style={styles.recordIcon}>
          <Icon
            name={getRecordIcon(record.type)}
            size={22}
            color={colors.primary[500]}
          />
        </View>

        <View style={styles.recordInfo}>
          <Text style={styles.recordTitle}>
            {record.title}
          </Text>
          <Text style={styles.recordDate}>
            {new Date(record.date || record.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </Text>
        </View>

        <Badge
          variant={record.status === 'verified' ? 'success' : 'warning'}
          size="sm"
        >
          {record.status}
        </Badge>
      </View>
    </Card>
  );

  if (loading) {
    return <Loading fullScreen text="Loading records..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Medical Records"
        leftIcon="back"
        onLeftPress={navigation.goBack}
        rightIcon="plus"
        onRightPress={() => navigation.navigate('UploadRecord')}
        rightIconProps={{
          background: 'solid',
        }}
      />

      <View style={styles.container}>
        <FlatList
          data={medicalRecords}
          renderItem={({ item }) => <RecordCard record={item} />}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              icon={
                <Icon
                  name="file-text"
                  size={48}
                  color={colors.gray[400]}
                />
              }
              title="No Medical Records"
              description="Upload your medical records to keep track of your health"
              actionLabel="Upload Record"
              onAction={() => navigation.navigate('UploadRecord')}
            />
          }
        />
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

  listContent: {
    padding: spacing.lg,
  },

  recordCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...shadows.sm,
  },

  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  recordIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  recordInfo: {
    flex: 1,
  },

  recordTitle: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[900],
  },

  recordDate: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    marginTop: 2,
  },
});

export default MedicalRecordsScreen;
