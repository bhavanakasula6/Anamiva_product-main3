/**
 * Application Constants
 */

// API Configuration
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5001/api';
export const API_TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT) || 10000;

// User Roles
export const USER_ROLES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
};

// Appointment Types
export const APPOINTMENT_TYPES = {
  ONLINE: 'online',
  IN_PERSON: 'clinic',  // Backend expects 'clinic' not 'in-person'
  // EMERGENCY: 'emergency',
};

// Appointment Status
// NOTE:
// Consultation consent can be CREATED only when appointment is UPCOMING
// Consultation consent is AUTO-EXPIRED when appointment becomes COMPLETED or CANCELLED
export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Emergency Urgency Levels
export const URGENCY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// Emergency Status
export const EMERGENCY_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Medical Record Types
export const RECORD_TYPES = {
  PRESCRIPTION: 'prescription',
  LAB_REPORT: 'lab-report',
  X_RAY: 'x-ray',
  OTHER: 'other',
};

// Record Status
export const RECORD_STATUS = {
  VERIFIED: 'verified',
  PENDING: 'pending',
  // TRANSCRIBED: 'transcribed',
  REJECTED: 'rejected',
};

// Medication Status
export const MEDICATION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  DISCONTINUED: 'discontinued',
};
// Consent Types
export const CONSENT_TYPES = {
  CONSULTATION: 'consultation',
  EXTENDED: 'extended',
};

// Consent Status
// ACTIVE: patient-approved
// REVOKED: patient manually removed
// EXPIRED: system-enforced (e.g. consultation ended)
export const CONSENT_STATUS = {
  ACTIVE: 'active',
  REVOKED: 'revoked',
  EXPIRED: 'expired',
};

// Access Request Status
export const ACCESS_REQUEST_STATUS = {
  PENDING: 'pending',
  DENIED: 'denied',
  CANCELLED: 'cancelled',
};

// Unified Access Resolution Status (Backend driven)
export const ACCESS_STATUS = {
  GRANTED: 'GRANTED',
  PENDING: 'PENDING',
  DENIED: 'DENIED',
  NO_ACCESS: 'NO_ACCESS',
};

// API Error Codes (SSOT)
export const API_ERROR_CODES = {
  CONSENT_ALREADY_EXISTS: 'CONSENT_ALREADY_EXISTS',
  CONSENT_NOT_FOUND: 'CONSENT_NOT_FOUND',
  CONSENT_NOT_ACTIVE: 'CONSENT_NOT_ACTIVE',

  ACCESS_ALREADY_GRANTED: 'ACCESS_ALREADY_GRANTED',
  ACCESS_REQUEST_NOT_FOUND: 'ACCESS_REQUEST_NOT_FOUND',
  ACCESS_REQUEST_NOT_PENDING: 'ACCESS_REQUEST_NOT_PENDING',
  ACCESS_UNAUTHORIZED: 'ACCESS_UNAUTHORIZED',

  APPOINTMENT_REQUIRED: 'APPOINTMENT_REQUIRED',
  APPOINTMENT_NOT_UPCOMING: 'APPOINTMENT_NOT_UPCOMING',
  REQUEST_EXPIRED: 'REQUEST_EXPIRED',
};

// Blood Groups
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Gender Options
export const GENDERS = ['male', 'female', 'other'];

// Medical Specializations
export const SPECIALIZATIONS = [
  'General Physician',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic',
  'Neurologist',
  'ENT',
  'Gynecologist',
  'Psychiatrist',
  'Dentist',
  'Ophthalmologist',
  'Urologist',
  'Gastroenterologist',
  'Endocrinologist',
  'Pulmonologist',
];

// Days of Week
export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Country Codes
export const COUNTRY_CODES = [
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
];

// Notification Types
export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'appointment',
  EMERGENCY: 'emergency',
  PRESCRIPTION: 'prescription',
  MESSAGE: 'message',
  SYSTEM: 'system',
};

// Analytics Periods
export const ANALYTICS_PERIODS = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  CUSTOM: 'custom',
};

// Search Radius for Emergency (in km)
export const EMERGENCY_SEARCH_RADIUS = 5;
export const EMERGENCY_SEARCH_RADIUS_MAX = 10;

// Slot Duration (in minutes)
export const DEFAULT_SLOT_DURATION = 30;

// Cancellation Cutoff (in hours)
export const CANCELLATION_CUTOFF_HOURS = 24;

// Pagination
export const ITEMS_PER_PAGE = 20;

// Image Upload
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

export default {
  API_BASE_URL,
  API_TIMEOUT,
  USER_ROLES,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
  URGENCY_LEVELS,
  EMERGENCY_STATUS,
  RECORD_TYPES,
  RECORD_STATUS,
  MEDICATION_STATUS,
  CONSENT_TYPES,
  CONSENT_STATUS,
  ACCESS_REQUEST_STATUS,
  ACCESS_STATUS,
  API_ERROR_CODES,
  BLOOD_GROUPS,
  GENDERS,
  SPECIALIZATIONS,
  DAYS_OF_WEEK,
  COUNTRY_CODES,
  NOTIFICATION_TYPES,
  ANALYTICS_PERIODS,
  EMERGENCY_SEARCH_RADIUS,
  DEFAULT_SLOT_DURATION,
  CANCELLATION_CUTOFF_HOURS,
  ITEMS_PER_PAGE,
  MAX_IMAGE_SIZE,
  ALLOWED_IMAGE_TYPES,
};
