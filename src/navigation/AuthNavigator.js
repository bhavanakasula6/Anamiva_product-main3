/**
 * Authentication Navigator
 * Stack navigation for authentication flow
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import auth screens
import {
  SplashScreen,
  LoginScreen,
  OTPVerificationScreen,
  RoleSelectionScreen,
  PatientProfileSetupScreen,
  DoctorProfileSetupScreen,
} from '../screens/auth';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="PatientProfileSetup" component={PatientProfileSetupScreen} />
      <Stack.Screen name="DoctorProfileSetup" component={DoctorProfileSetupScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
