/**
 * Doctor Record Verification Screen
 * Review & verify patient-uploaded records
 */

import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useDoctor } from '../../contexts/DoctorContext';

import {
  Card,
  Badge,
  Button,
  EmptyState,
  Loading,
  Header,
} from '../../components/common';

import Icon from '../../components/Icon';
import { colors, spacing, typography, shadows } from '../../styles/theme';

const DoctorRecordVerificationScreen = ({ navigation }) => {
  const {
    pendingRecords,
    loadPendingRecords,
    verifyRecord,
    rejectRecord,
  } = useDoctor();

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      let active = true;

      (async () => {
      setLoading(true);
      await loadPendingRecords();
        if (active) setLoading(false);
      })();

      return () => {
        active = false;
      };
    }, [])
  );

  const handleVerify = async (recordId) => {
    setProcessingId(recordId);
    const res = await verifyRecord(recordId);
    setProcessingId(null);

    if (!res?.success) {
      Alert.alert('Error', 'Failed to verify record');
    }
  };

  const handleReject = (recordId) => {
    Alert.alert(
      'Reject Record',
      'Are you sure you want to reject this record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setProcessingId(recordId);
            const res = await rejectRecord(recordId, 'Rejected by doctor');
            setProcessingId(null);

            if (!res?.success) {
              Alert.alert('Error', 'Failed to reject record');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate('RecordDetails', {
            record: item,
            mode: 'DOCTOR_VERIFY',
        })
      }
    >
      <View style={styles.row}>
        <Icon name="file-text" size={20} color={colors.primary[500]} />

        <View style={styles.info}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.sub}>
            Uploaded on {new Date(item.createdAt).toDateString()}
          </Text>
        </View>

        <Badge variant="warning" size="sm">
          Pending
        </Badge>
      </View>

      <View style={styles.actions}>
        <Button
          size="sm"
          variant="outline"
          onPress={() => handleReject(item.id)}
          disabled={processingId !== null}
        >
          Reject
        </Button>

        <Button
          size="sm"
          onPress={() => handleVerify(item.id)}
          loading={processingId === item.id}
          disabled={processingId !== null}
        >
          Verify
        </Button>
      </View>
    </Card>
  );

  if (loading) {
    return <Loading fullScreen text="Loading pending records..." />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Pending Records"
        leftIcon="back"
        onLeftPress={navigation.goBack}
      />

      <FlatList
        data={pendingRecords}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon={<Icon name="check-circle" size={48} color={colors.gray[400]} />}
            title="No Pending Records"
            description="All uploaded records have been reviewed"
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  list: { padding: spacing.lg },
  card: { marginBottom: spacing.md, padding: spacing.lg, ...shadows.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  info: { flex: 1 },
  title: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.gray[900],
  },
  sub: { fontSize: typography.fontSize.sm, color: colors.gray[600] },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
});

export default DoctorRecordVerificationScreen;
