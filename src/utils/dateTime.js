/**
 * Date and Time Utilities
 */

// Format date to readable string (e.g., "Nov 15, 2025")
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format time to 12-hour format (e.g., "10:00 AM")
export const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Format datetime to readable string (e.g., "Nov 15, 2025 at 10:00 AM")
export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

// Get relative time (e.g., "2 hours ago", "in 3 days")
export const getRelativeTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHour < 24) return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
  if (diffDay < 7) return `${diffDay} ${diffDay === 1 ? 'day' : 'days'} ago`;
  return formatDate(dateTimeString);
};

// Get time from now (future)
export const getTimeFromNow = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  const now = new Date();
  const diffMs = date - now;

  if (diffMs < 0) return getRelativeTime(dateTimeString);

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'in a moment';
  if (diffMin < 60) return `in ${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'}`;
  if (diffHour < 24) return `in ${diffHour} ${diffHour === 1 ? 'hour' : 'hours'}`;
  if (diffDay < 7) return `in ${diffDay} ${diffDay === 1 ? 'day' : 'days'}`;
  return formatDate(dateTimeString);
};

// Check if date is today
export const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Check if date is tomorrow
export const isTomorrow = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

// Check if date is in the past
export const isPast = (dateTimeString) => {
  if (!dateTimeString) return false;
  const date = new Date(dateTimeString);
  const now = new Date();
  return date < now;
};

// Check if date is in the future
export const isFuture = (dateTimeString) => {
  if (!dateTimeString) return false;
  const date = new Date(dateTimeString);
  const now = new Date();
  return date > now;
};

// Get date string in YYYY-MM-DD format
export const getDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get time string in HH:MM format
export const getTimeString = (date = new Date()) => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Combine date and time strings to ISO string
export const combineDateTimeToISO = (dateString, timeString) => {
  return new Date(`${dateString}T${timeString}:00`).toISOString();
};

// Get day of week
export const getDayOfWeek = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Get month name
export const getMonthName = (monthIndex) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months[monthIndex];
};

// Get calendar dates for a month
export const getCalendarDates = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const dates = [];

  // Add empty slots for days before the month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    dates.push(null);
  }

  // Add all days in the month
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(new Date(year, month, day));
  }

  return dates;
};

// Check if date is within cutoff time
export const isWithinCutoff = (dateTimeString, cutoffHours) => {
  if (!dateTimeString) return false;
  const date = new Date(dateTimeString);
  const now = new Date();
  const diffMs = date - now;
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours < cutoffHours;
};

// Add hours to date
export const addHours = (date, hours) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

// Add days to date
export const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export default {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  getTimeFromNow,
  isToday,
  isTomorrow,
  isPast,
  isFuture,
  getDateString,
  getTimeString,
  combineDateTimeToISO,
  getDayOfWeek,
  getMonthName,
  getCalendarDates,
  isWithinCutoff,
  addHours,
  addDays,
};
