/**
 * Patient Profile Setup Screen
 * Complete patient profile information
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { colors, typography, spacing } from '../../styles/theme';
import { Button, Input } from '../../components/common';
import { validateEmail, validateRequired } from '../../utils/validation';
import { USER_ROLES, BLOOD_GROUPS, GENDERS } from '../../data/constants';
import Icon from '../../components/Icon';

const PatientProfileSetupScreen = ({ navigation, route }) => {
  const { phone, role } = route.params;
  const { completeProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    address: '',
    city: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-GB'); // DD/MM/YYYY
      updateField('dateOfBirth', formattedDate);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        ...formData,
        phone,
        role: USER_ROLES.PATIENT,
        fullName: `${formData.firstName} ${formData.lastName}`,
        phoneVerified: true,
        avatar: `https://i.pravatar.cc/150?u=${phone}`,
        address: {
          street: formData.address,
          city: formData.city,
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
        },
        location: {
          latitude: 19.0760 + (Math.random() - 0.5) * 0.1,
          longitude: 72.8777 + (Math.random() - 0.5) * 0.1,
        },
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
          relationship: 'Family',
        },
        medicalHistory: {
          conditions: [],
          allergies: [],
          previousSurgeries: [],
          familyHistory: null,
        },
      };

      const response = await completeProfile(profileData);

      if (response.success) {
        navigation.replace('Main');
      } else {
        Alert.alert('Error', response.message || 'Failed to create profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Complete Your Profile</Text>
              <Text style={styles.subtitle}>
                Help us serve you better by providing your information
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Personal Information */}
              <View style={styles.sectionHeader}>
                <Icon name="personalInfo" size={28} color={colors.primary[500]} />
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>


              <Input
                label="First Name *"
                value={formData.firstName}
                onChangeText={(value) => updateField('firstName', value)}
                placeholder="Enter first name"
                error={errors.firstName}
                autoCapitalize="words"
              />

              <Input
                label="Last Name *"
                value={formData.lastName}
                onChangeText={(value) => updateField('lastName', value)}
                placeholder="Enter last name"
                error={errors.lastName}
                autoCapitalize="words"
              />

              <Input
                label="Email *"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
              />

              {/* Date Picker */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Date of Birth *</Text>
                <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                  <Icon name="calendar" size={16} color={colors.gray[500]} />
                  <Text style={styles.datePickerText}>
                    {formData.dateOfBirth || 'Select date'}
                  </Text>
                </TouchableOpacity>
                {errors.dateOfBirth && (
                  <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                )}
              </View>

              {/* Gender Selection */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Gender *</Text>

                <View style={styles.optionsRow}>
                  {GENDERS.map((gender) => {
                    const isSelected = formData.gender === gender;

                    return (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.optionButton,
                          isSelected && styles.optionButtonSelected,
                        ]}
                        onPress={() => updateField('gender', gender)}
                      >
                        <Icon
                          name={
                            gender === 'male'
                              ? 'male'
                              : gender === 'female'
                                ? 'female'
                                : 'gender-other'
                          }
                          size={18}
                          color={isSelected ? colors.primary[500] : colors.gray[600]}
                        />

                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
              </View>


              {/* Blood Group Selection */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Blood Group *</Text>
                <View style={styles.optionsGrid}>
                  {BLOOD_GROUPS.map((group) => (
                    <TouchableOpacity
                      key={group}
                      style={[
                        styles.gridButton,
                        formData.bloodGroup === group && styles.gridButtonSelected,
                      ]}
                      onPress={() => updateField('bloodGroup', group)}
                    >
                      <Text
                        style={[
                          styles.gridButtonText,
                          formData.bloodGroup === group && styles.gridButtonTextSelected,
                        ]}
                      >
                        {group}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.bloodGroup && <Text style={styles.errorText}>{errors.bloodGroup}</Text>}
              </View>

              {/* Address */}
              <Text style={styles.sectionTitle}>Address</Text>

              <Input
                label="Street Address"
                value={formData.address}
                onChangeText={(value) => updateField('address', value)}
                placeholder="Enter street address"
              />

              <Input
                label="City"
                value={formData.city}
                onChangeText={(value) => updateField('city', value)}
                placeholder="Enter city"
                autoCapitalize="words"
              />

              {/* Emergency Contact */}
              <Text style={styles.sectionTitle}>Emergency Contact</Text>

              <Input
                label="Contact Name"
                value={formData.emergencyContactName}
                onChangeText={(value) => updateField('emergencyContactName', value)}
                placeholder="Enter contact name"
                autoCapitalize="words"
              />

              <Input
                label="Contact Phone"
                value={formData.emergencyContactPhone}
                onChangeText={(value) => updateField('emergencyContactPhone', value)}
                placeholder="Enter contact phone"
                keyboardType="phone-pad"
              />

              {/* Submit Button */}
              <Button
                onPress={handleSubmit}
                loading={loading}
                fullWidth
                style={styles.submitButton}
              >
                Complete Profile
              </Button>
            </View>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            maximumDate={new Date()}
            onChange={onDateChange}
          />
        )}

      </KeyboardAvoidingView>
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
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing['2xl'],
  },
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    color: colors.gray[600],
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  datePickerText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },

  form: {
    marginTop: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  optionText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[700],
  },
  optionTextSelected: {
    color: colors.primary[500],
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridButton: {
    width: '22%',
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    alignItems: 'center',
  },
  gridButtonSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  gridButtonText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[700],
  },
  gridButtonTextSelected: {
    color: colors.primary[500],
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.danger[500],
    marginTop: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.xl,
  },
});

export default PatientProfileSetupScreen;
