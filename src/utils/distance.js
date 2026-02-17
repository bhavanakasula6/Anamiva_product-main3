/**
 * Distance and Location Utilities
 */

// Calculate distance between two coordinates using Haversine formula
// Returns distance in kilometers
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

// Convert degrees to radians
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Format distance for display
export const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
};

// Check if location is within radius
export const isWithinRadius = (lat1, lon1, lat2, lon2, radiusKm) => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2);
  return distance <= radiusKm;
};

// Sort items by distance from a location
export const sortByDistance = (items, userLat, userLon, locationKey = 'location') => {
  return items
    .map((item) => {
      const itemLocation = item[locationKey];
      if (!itemLocation || !itemLocation.latitude || !itemLocation.longitude) {
        return { ...item, distance: Infinity };
      }
      const distance = calculateDistance(
        userLat,
        userLon,
        itemLocation.latitude,
        itemLocation.longitude
      );
      return { ...item, distance };
    })
    .sort((a, b) => a.distance - b.distance);
};

// Filter items within radius
export const filterByRadius = (
  items,
  userLat,
  userLon,
  radiusKm,
  locationKey = 'location'
) => {
  return items.filter((item) => {
    const itemLocation = item[locationKey];
    if (!itemLocation || !itemLocation.latitude || !itemLocation.longitude) {
      return false;
    }
    return isWithinRadius(
      userLat,
      userLon,
      itemLocation.latitude,
      itemLocation.longitude,
      radiusKm
    );
  });
};

// Get estimated travel time (simplified, assumes average speed of 40 km/h in city)
export const getEstimatedTravelTime = (distanceInKm, averageSpeedKmh = 40) => {
  const hours = distanceInKm / averageSpeedKmh;
  const minutes = Math.round(hours * 60);
  return minutes;
};

// Format travel time for display
export const formatTravelTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }
  return `${hours}h ${remainingMinutes}min`;
};

export default {
  calculateDistance,
  formatDistance,
  isWithinRadius,
  sortByDistance,
  filterByRadius,
  getEstimatedTravelTime,
  formatTravelTime,
};
