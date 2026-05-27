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

import { useAuth } from '../../contexts/AuthContext';
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
import { SPECIALIZATIONS, INDIAN_STATES, CITIES_BY_STATE, MAJOR_CITIES } from '../../data/constants';

const DoctorSearchScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { searchDoctors } = usePatient();

  const patientCity = typeof user?.address === 'object' ? user?.address?.city || '' : '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const [selectedCity, setSelectedCity] = useState(patientCity);

  const [filters, setFilters] = useState({
    availableNow: false,
    sortBy: 'rating',
  });

  useEffect(() => {
    loadDoctors();
  }, [selectedSpecialization, filters, selectedCity]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      // Always pass patient location for distance calculation
      const hasLocation = user?.location?.latitude;
      const response = await searchDoctors({
        query: searchQuery,
        specialization: selectedSpecialization,
        availableNow: filters.availableNow,
        sortBy: filters.sortBy,
        // Pass city filter for city-based filtering
        ...(selectedCity && { city: selectedCity }),
        ...(hasLocation && {
          latitude: user.location.latitude,
          longitude: user.location.longitude,
          radius: 50,
        }),
      });

      if (response?.success) {
        setDoctors(response.doctors);
      }
    } finally {
      setLoading(false);
    }
  };

  const getDoctorName = (doc) => {
    const u = doc.userId;
    if (u?.name) return u.name;
    if (u?.fullName) return u.fullName;
    if (u?.firstName) return `${u.firstName} ${u.lastName || ''}`.trim();
    return doc.fullName || 'Doctor';
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
          name={getDoctorName(doctor)}
        />

        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{getDoctorName(doctor)}</Text>
          <Text style={styles.doctorSpecialty}>
            {doctor.speciality || doctor.specialization}
          </Text>
          {(() => {
            const addr = doctor.userId?.address;
            const city = (addr && typeof addr === 'object') ? addr.city : null;
            const clinicAddr = doctor.clinicInfo?.address;
            const location = city || clinicAddr;
            if (!location) return null;
            return (
              <View style={styles.cityRow}>
                <Icon name="map-pin" size={12} color={colors.gray[500]} />
                <Text style={styles.doctorCity}>{location}</Text>
              </View>
            );
          })()}

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
            style={[
              styles.filterChip,
              selectedCity && styles.locationChipActive,
            ]}
            onPress={() => setShowLocationFilter(!showLocationFilter)}
          >
            <Icon
              name="map-pin"
              size={14}
              color={selectedCity ? colors.primary[500] : colors.gray[500]}
            />
            <Text style={[
              styles.filterText,
              selectedCity && { color: colors.primary[600] },
            ]}>
              {selectedCity || 'All Cities'}
            </Text>
            {selectedCity ? (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation && e.stopPropagation();
                  setSelectedCity('');
                  setShowLocationFilter(false);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="x" size={12} color={colors.primary[500]} />
              </TouchableOpacity>
            ) : null}
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

        {/* City Filter Dropdown */}
        {showLocationFilter && (
          <View style={styles.cityFilterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cityChipsContent}
            >
              <TouchableOpacity
                style={[
                  styles.cityChip,
                  !selectedCity && styles.cityChipSelected,
                ]}
                onPress={() => {
                  setSelectedCity('');
                  setShowLocationFilter(false);
                }}
              >
                <Text style={[
                  styles.cityChipText,
                  !selectedCity && styles.cityChipTextSelected,
                ]}>
                  All Cities
                </Text>
              </TouchableOpacity>
              {patientCity ? (
                <TouchableOpacity
                  style={[
                    styles.cityChip,
                    selectedCity === patientCity && styles.cityChipSelected,
                    { borderColor: colors.success[400] },
                  ]}
                  onPress={() => {
                    setSelectedCity(patientCity);
                    setShowLocationFilter(false);
                  }}
                >
                  <Icon name="map-pin" size={12} color={colors.success[600]} />
                  <Text style={[
                    styles.cityChipText,
                    selectedCity === patientCity && styles.cityChipTextSelected,
                  ]}>
                    {patientCity} (My City)
                  </Text>
                </TouchableOpacity>
              ) : null}
              {MAJOR_CITIES.filter(c => c !== patientCity).slice(0, 30).map((ct) => (
                <TouchableOpacity
                  key={ct}
                  style={[
                    styles.cityChip,
                    selectedCity === ct && styles.cityChipSelected,
                  ]}
                  onPress={() => {
                    setSelectedCity(ct);
                    setShowLocationFilter(false);
                  }}
                >
                  <Text style={[
                    styles.cityChipText,
                    selectedCity === ct && styles.cityChipTextSelected,
                  ]}>
                    {ct}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Results info */}
        {selectedCity && !loading && (
          <View style={styles.resultInfoRow}>
            <Icon name="map-pin" size={14} color={colors.primary[500]} />
            <Text style={styles.resultInfoText}>
              Showing doctors in {selectedCity}
            </Text>
          </View>
        )}

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
                  {selectedCity
                    ? `No doctors found in ${selectedCity}. Try selecting a different city.`
                    : 'Try adjusting filters'}
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
    minHeight: 52,
    maxHeight: 56,
  },
  specializationsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    paddingRight: spacing.xl,
    gap: spacing.sm,
  },
  specializationChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
    justifyContent: 'center',
    height: 34,
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

  locationChipActive: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[500],
  },

  cityFilterContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },

  cityChipsContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginRight: spacing.sm,
  },

  cityChipSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },

  cityChipText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[700],
  },

  cityChipTextSelected: {
    color: colors.primary[600],
  },

  resultInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary[50],
  },

  resultInfoText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary[600],
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

  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },

  doctorCity: {
    fontSize: typography.fontSize.xs,
    color: colors.gray[500],
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
