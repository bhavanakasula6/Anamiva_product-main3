/**
 * AsyncStorage Service
 * Wrapper for AsyncStorage with utility methods
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'medapp_user',
  ROLE: 'medapp_role',
  TOKEN: 'medapp_token',
  PROFILE_COMPLETE: 'medapp_profile_complete',
  RECENT_SEARCHES: 'medapp_recent_searches',
  APP_SETTINGS: 'medapp_settings',
};

// Save data to storage
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving data to storage:', error);
    return false;
  }
};

// Get data from storage
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error getting data from storage:', error);
    return null;
  }
};

// Remove data from storage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data from storage:', error);
    return false;
  }
};

// Clear all data from storage
// WARNING: clearAll is for debugging / full reset only
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

// Save user data
export const saveUser = async (user) => {
  return await saveData(STORAGE_KEYS.USER, user);
};

// Get user data
export const getUser = async () => {
  return await getData(STORAGE_KEYS.USER);
};

// Save user role
export const saveRole = async (role) => {
  return await saveData(STORAGE_KEYS.ROLE, role);
};

// Get user role
export const getRole = async () => {
  return await getData(STORAGE_KEYS.ROLE);
};

// Save auth token
export const saveToken = async (token) => {
  return await saveData(STORAGE_KEYS.TOKEN, token);
};

// Get auth token
export const getToken = async () => {
  return await getData(STORAGE_KEYS.TOKEN);
};

// Save profile completion status
export const saveProfileComplete = async (isComplete) => {
  return await saveData(STORAGE_KEYS.PROFILE_COMPLETE, isComplete);
};

// Get profile completion status
export const getProfileComplete = async () => {
  return await getData(STORAGE_KEYS.PROFILE_COMPLETE);
};


// Save recent searches
export const saveRecentSearches = async (searches) => {
  return await saveData(STORAGE_KEYS.RECENT_SEARCHES, searches);
};

// Get recent searches
export const getRecentSearches = async () => {
  const searches = await getData(STORAGE_KEYS.RECENT_SEARCHES);
  return searches || [];
};

// Add to recent searches
export const addRecentSearch = async (searchTerm) => {
  const searches = await getRecentSearches();
  // Remove if already exists
  const filtered = searches.filter((s) => s !== searchTerm);
  // Add to beginning
  filtered.unshift(searchTerm);
  // Keep only last 10
  const updated = filtered.slice(0, 10);
  await saveRecentSearches(updated);
  return updated;
};

// Clear recent searches
export const clearRecentSearches = async () => {
  return await saveData(STORAGE_KEYS.RECENT_SEARCHES, []);
};

// Save app settings
export const saveSettings = async (settings) => {
  return await saveData(STORAGE_KEYS.APP_SETTINGS, settings);
};

// Get app settings
export const getSettings = async () => {
  const settings = await getData(STORAGE_KEYS.APP_SETTINGS);
  return settings || {
    notifications: true,
    darkMode: false,
    language: 'en',
  };
};

// Logout (clear auth data)
export const logoutUser = async () => {
  try {
    await removeData(STORAGE_KEYS.USER);
    await removeData(STORAGE_KEYS.ROLE);
    await removeData(STORAGE_KEYS.TOKEN);
    await removeData(STORAGE_KEYS.PROFILE_COMPLETE);
    await removeData(STORAGE_KEYS.RECENT_SEARCHES);
    // optionally APP_SETTINGS
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};


const storage = {
  saveData,
  getData,
  removeData,
  clearAll,
  saveUser,
  getUser,
  saveRole,
  getRole,
  saveToken,
  getToken,
  saveProfileComplete,
  getProfileComplete,
  saveRecentSearches,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  saveSettings,
  getSettings,
  logout: logoutUser,
};

export default storage;
