/**
 * Data Formatting Utilities
 */

// Format phone number with country code
export const formatPhoneNumber = (phone, countryCode = '+1') => {
  if (!phone) return '';
  return `${countryCode} ${phone}`;
};

// Mask phone number (e.g., "+1 *******890")
export const maskPhoneNumber = (phone, countryCode = '+1') => {
  if (!phone) return '';
  const visibleDigits = phone.slice(-3);
  const maskedPart = '*'.repeat(phone.length - 3);
  return `${countryCode} ${maskedPart}${visibleDigits}`;
};

// Format currency
export const formatCurrency = (amount, currency = '$') => {
  if (typeof amount !== 'number') return `${currency}0`;
  return `${currency}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '0%';
  return `${value.toFixed(decimals)}%`;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Capitalize all words
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

// Truncate text
export const truncate = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Generate initials from name
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Format rating (e.g., "4.8 ★")
export const formatRating = (rating) => {
  if (typeof rating !== 'number') return '0.0 ★';
  return `${rating.toFixed(1)} ★`;
};

// Pluralize word based on count
export const pluralize = (word, count) => {
  if (count === 1) return word;
  // Simple pluralization (add 's')
  // You can extend this with more complex rules
  return `${word}s`;
};

// Format count with label (e.g., "5 appointments", "1 appointment")
export const formatCount = (count, singular, plural) => {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
};

// Format name with title (Dr., Mr., Mrs.)
export const formatNameWithTitle = (name, isDoctor = false) => {
  if (!name) return '';
  return isDoctor ? `Dr. ${name}` : name;
};

// Format blood group
export const formatBloodGroup = (bloodGroup) => {
  if (!bloodGroup) return '';
  return bloodGroup.toUpperCase();
};

// Format height (cm to feet/inches)
export const formatHeight = (cm, unit = 'cm') => {
  if (!cm) return '';
  if (unit === 'cm') {
    return `${cm} cm`;
  }
  // Convert to feet and inches
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return `${feet}'${remainingInches}"`;
};

// Format weight (kg to lbs)
export const formatWeight = (kg, unit = 'kg') => {
  if (!kg) return '';
  if (unit === 'kg') {
    return `${kg} kg`;
  }
  // Convert to pounds
  const lbs = Math.round(kg * 2.20462);
  return `${lbs} lbs`;
};

// Format medication frequency
export const formatMedicationFrequency = (frequency) => {
  const frequencyMap = {
    'once daily': 'Once a day',
    'twice daily': 'Twice a day',
    'thrice daily': 'Three times a day',
    'four times daily': 'Four times a day',
    'as needed': 'As needed',
    'every 4 hours': 'Every 4 hours',
    'every 6 hours': 'Every 6 hours',
    'every 8 hours': 'Every 8 hours',
    'every 12 hours': 'Every 12 hours',
    'before meals': 'Before meals',
    'after meals': 'After meals',
    'at bedtime': 'At bedtime',
  };
  return frequencyMap[frequency?.toLowerCase()] || capitalize(frequency);
};

// Format address (single line)
export const formatAddress = (address) => {
  if (!address) return '';
  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
  ].filter(Boolean);
  return parts.join(', ');
};

export default {
  formatPhoneNumber,
  maskPhoneNumber,
  formatCurrency,
  formatPercentage,
  capitalize,
  capitalizeWords,
  truncate,
  formatFileSize,
  getInitials,
  formatRating,
  pluralize,
  formatCount,
  formatNameWithTitle,
  formatBloodGroup,
  formatHeight,
  formatWeight,
  formatMedicationFrequency,
  formatAddress,
};
