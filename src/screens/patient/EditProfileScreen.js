/**
 * Edit Profile Screen
 * Patient profile editing
 */

import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../contexts/AuthContext';
import {
  colors,
  spacing,
  typography
} from '../../styles/theme';

import {
  Avatar,
  Button,
  Header,
  Input,
} from '../../components/common';

import Icon from '../../components/Icon';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || user?.name?.split(' ')[0] || '',
    lastName: user?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phoneNumber || user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '',
    height: user?.height?.toString() || '',
    weight: user?.weight?.toString() || '',
    address: typeof user?.address === 'object' ? user?.address?.street || '' : user?.address || '',
  });

  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Edit Profile"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity activeOpacity={0.7}>
              <Avatar
                source={{ uri: user?.avatar }}
                size={100}
                name={`${user?.firstName} ${user?.lastName}`}
              />

              <View style={styles.cameraIconContainer}>
                <Icon
                  name="camera"
                  size={16}
                  color={colors.white}
                />
              </View>
            </TouchableOpacity>

            <Text style={styles.changePhotoText}>
              Tap to change photo
            </Text>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Personal Information
            </Text>

            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={text =>
                setFormData({ ...formData, firstName: text })
              }
              placeholder="Enter first name"
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChangeText={text =>
                setFormData({ ...formData, lastName: text })
              }
              placeholder="Enter last name"
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={text =>
                setFormData({ ...formData, email: text })
              }
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Phone"
              value={formData.phone}
              editable={false}
              placeholder="Phone number"
              keyboardType="phone-pad"
            />

            <Input
              label="Date of Birth"
              value={formData.dateOfBirth}
              onChangeText={text =>
                setFormData({ ...formData, dateOfBirth: text })
              }
              placeholder="DD/MM/YYYY"
            />

            <Input
              label="Gender"
              value={formData.gender}
              onChangeText={text =>
                setFormData({ ...formData, gender: text })
              }
              placeholder="Male / Female / Other"
            />
          </View>

          {/* Medical Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Medical Information
            </Text>

            <Input
              label="Blood Group"
              value={formData.bloodGroup}
              onChangeText={text =>
                setFormData({ ...formData, bloodGroup: text })
              }
              placeholder="e.g. A+, O-, B+"
            />

            <Input
              label="Height (cm)"
              value={formData.height}
              onChangeText={text =>
                setFormData({ ...formData, height: text })
              }
              placeholder="Enter height"
              keyboardType="numeric"
            />

            <Input
              label="Weight (kg)"
              value={formData.weight}
              onChangeText={text =>
                setFormData({ ...formData, weight: text })
              }
              placeholder="Enter weight"
              keyboardType="numeric"
            />
          </View>

          {/* Address */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>

            <Input
              label="Address"
              value={formData.address}
              onChangeText={text =>
                setFormData({ ...formData, address: text })
              }
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Save */}
          <Button
            onPress={handleUpdate}
            loading={loading}
            fullWidth
            style={styles.saveButton}
          >
            Save Changes
          </Button>
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.lg,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary[500],
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  changePhotoText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary[500],
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  saveButton: {
    marginBottom: spacing.xl,
  },
});

export default EditProfileScreen;
