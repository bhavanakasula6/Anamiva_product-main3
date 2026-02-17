/**
 * Doctor Search Screen
 * Search and filter doctors with modern UI
 */

import { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePatient } from '../../contexts/PatientContext';
import {
  borderRadius,
  colors,
  spacing,
  typography
} from '../../styles/theme';

import {
  Avatar,
  Badge,
  Card,
  Header,
  Loading,
  SearchBar,
} from '../../components/common';

import Icon from '../../components/Icon';
import { SPECIALIZATIONS } from '../../data/constants';

const DoctorSearchScreen = ({ navigation }) => {
  const { searchDoctors } = usePatient();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    availableNow: false,
    sortBy: 'rating',
  });

  useEffect(() => {
    loadDoctors();
  }, [selectedSpecialization, filters]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const response = await searchDoctors({
        query: searchQuery,
        specialization: selectedSpecialization,
        availableNow: filters.availableNow,
        sortBy: filters.sortBy,
      });

      if (response?.success) {
        setDoctors(response.doctors);
      }
    } finally {
      setLoading(false);
    }
  };

  const DoctorCard = ({ doctor }) => (
    <Card
      style={styles.doctorCard}
      onPress={() =>
        navigation.navigate('DoctorDetails', { doctorId: doctor._id })
      }
    >
      {/* Header */}
      <View style={styles.doctorCardHeader}>
        <Avatar
          source={{ uri: doctor.userId?.profilePicture || doctor.avatar }}
          size={60}
          name={doctor.userId?.name || doctor.fullName}
        />

        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.userId?.name || doctor.fullName}</Text>
          <Text style={styles.doctorSpecialty}>
            {doctor.speciality || doctor.specialization}
          </Text>

          <View style={styles.ratingRow}>
            <Icon name="star" size={14} color={colors.warning[500]} />
            <Text style={styles.ratingText}>
              {doctor.rating || 0} ({doctor.reviewCount || 0})
            </Text>
          </View>
        </View>

        {doctor.availability?.online && (
          <Badge variant="success" size="sm">
            Online
          </Badge>
        )}
      </View>

      {/* Details */}
      <View style={styles.doctorDetails}>
        <View style={styles.detailItem}>
          <Icon name="briefcase" size={14} color={colors.gray[600]} />
          <Text style={styles.detailText}>
            {doctor.experience || 0}+ yrs
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Icon name="wallet" size={14} color={colors.gray[600]} />
          <Text style={styles.detailText}>
            ₹{doctor.consultationFee || 0}
          </Text>
        </View>

        {doctor.distance && (
          <View style={styles.detailItem}>
            <Icon name="map-pin" size={14} color={colors.gray[600]} />
            <Text style={styles.detailText}>
              {doctor.distance.toFixed(1)} km
            </Text>
          </View>
        )}
      </View>

      {/* Action */}
      <TouchableOpacity
        style={styles.bookButton}
        onPress={() =>
          navigation.navigate('BookAppointment', { doctorId: doctor._id })
        }
      >
        <Text style={styles.bookButtonText}>Book Appointment</Text>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header
        title="Find Doctors"
        leftIcon="back"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.container}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search doctors, specializations..."
            icon={<Icon name="search" size={18} color={colors.gray[500]} />}
            onSubmitEditing={loadDoctors}
          />
        </View>

        {/* Specializations */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.specializationsScroll}
          contentContainerStyle={styles.specializationsContent}
        >
          <Chip
            label="All"
            active={!selectedSpecialization}
            onPress={() => setSelectedSpecialization(null)}
          />

          {SPECIALIZATIONS.map(spec => (
            <Chip
              key={spec}
              label={spec}
              active={selectedSpecialization === spec}
              onPress={() => setSelectedSpecialization(spec)}
            />
          ))}
        </ScrollView>

        {/* Filters */}
        <View style={styles.filtersRow}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filters.availableNow && styles.filterChipActive,
            ]}
            onPress={() =>
              setFilters(f => ({
                ...f,
                availableNow: !f.availableNow,
              }))
            }
          >
            <Icon
              name="check"
              size={14}
              color={
                filters.availableNow
                  ? colors.success[600]
                  : colors.gray[500]
              }
            />
            <Text style={styles.filterText}>Available Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sortChip}
            onPress={() =>
              setFilters(f => ({
                ...f,
                sortBy: f.sortBy === 'rating' ? 'distance' : 'rating',
              }))
            }
          >
            <Icon name="arrow-up" size={14} color={colors.gray[600]} />
            <Icon name="arrow-down" size={14} color={colors.gray[600]} />
            <Text style={styles.filterText}>
              {filters.sortBy === 'rating'
                ? 'Rating'
                : 'Distance'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {loading ? (
          <Loading text="Finding doctors..." />
        ) : (
          <FlatList
            data={doctors}
            renderItem={({ item }) => (
              <DoctorCard doctor={item} />
            )}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="search" size={48} color={colors.gray[400]} />
                <Text style={styles.emptyText}>
                  No doctors found
                </Text>
                <Text style={styles.emptySubtext}>
                  Try adjusting filters
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

/* ---------- Small helper ---------- */
const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.specializationChip,
      active && styles.specializationChipActive,
    ]}
  >
    <Text
      style={[
        styles.specializationText,
        active && styles.specializationTextActive,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, backgroundColor: colors.gray[50] },

  searchContainer: {
    padding: spacing.lg,
    backgroundColor: colors.white,
  },
  specializationsScroll: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    height: 150,
  },
  specializationsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  specializationChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
    justifyContent: 'center',
  },
  specializationChipActive: {
    backgroundColor: colors.primary[500],
  },
  specializationText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[700],
  },
  specializationTextActive: {
    color: colors.white,
  },
  filtersRow: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.white,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },

  filterChipActive: {
    backgroundColor: colors.success[50],
    borderWidth: 1,
    borderColor: colors.success[500],
  },

  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },

  filterText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },

  listContent: {
    padding: spacing.lg,
  },

  doctorCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },

  doctorCardHeader: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },

  doctorInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  doctorName: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.bold,
  },

  doctorSpecialty: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  ratingText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },

  doctorDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    marginBottom: spacing.md,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  detailText: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[700],
  },

  bookButton: {
    backgroundColor: colors.primary[500],
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },

  bookButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },

  emptyText: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.semiBold,
    marginTop: spacing.md,
  },

  emptySubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
  },
});

export default DoctorSearchScreen;
