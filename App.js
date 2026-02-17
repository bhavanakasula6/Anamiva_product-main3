/**
 * MedApp - Medical Appointment & Emergency Care Application
 * Main App Entry Point
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, PatientProvider, DoctorProvider } from './src/contexts';
import RootNavigator from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <PatientProvider>
        <DoctorProvider>
          <StatusBar style="auto" />
          <RootNavigator />
        </DoctorProvider>
      </PatientProvider>
    </AuthProvider>
  );
}
