# MedApp - Medical Appointment & Emergency Care Application

A comprehensive React Native mobile application for managing medical appointments, emergency care requests, and health records. Built with Expo, featuring a modern UI and complete mock backend.

## 🎯 Features

### For Patients
- 👨‍⚕️ **Find & Book Doctors** - Search by specialization, location, and availability
- 🚨 **Emergency Requests** - Quick access to nearby doctors for urgent care
- 📅 **Appointment Management** - Book, reschedule, and track appointments
- 📋 **Medical Records** - Upload and manage health records
- 💊 **Medication Tracking** - Keep track of active medications
- ❤️ **Favorite Doctors** - Save preferred healthcare providers

### For Doctors
- 📊 **Dashboard & Analytics** - View revenue, patient stats, and performance metrics
- 📅 **Appointment Management** - Accept, reject, and manage patient appointments
- 🚨 **Emergency Response** - Accept and respond to emergency requests
- 👥 **Patient Records** - Access patient medical history and records
- ⚕️ **Prescription Management** - Create and manage prescriptions
- 📈 **Business Insights** - Track appointments, revenue, and demographics

## 🏗️ Architecture

### Tech Stack
- **React Native 0.81.5** - Cross-platform mobile framework
- **Expo ~54.0** - Development platform and SDK
- **TypeScript ~5.9** - Type safety
- **NativeWind 4.2** - Tailwind CSS for React Native

### Project Structure

```
MedApp_ReactNative/
├── src/
│   ├── components/
│   │   └── common/          # Reusable UI components
│   │       ├── Button.js
│   │       ├── Input.js
│   │       ├── Card.js
│   │       ├── Modal.js
│   │       └── ... (11 total)
│   │
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.js
│   │   ├── PatientContext.js
│   │   └── DoctorContext.js
│   │
│   ├── data/
│   │   ├── constants.js     # App constants
│   │   └── mockData.js      # Mock data (55 patients, 35 doctors, 120+ appointments)
│   │
│   ├── screens/
│   │   ├── auth/           # Authentication screens (6 screens)
│   │   ├── patient/        # Patient screens (9 screens)
│   │   └── doctor/         # Doctor screens (3 screens)
│   │
│   ├── services/
│   │   ├── api.js          # Mock API service
│   │   └── storage.js      # AsyncStorage wrapper
│   │
│   ├── styles/
│   │   └── theme.js        # Design system (colors, typography, spacing)
│   │
│   └── utils/              # Utility functions
│       ├── validation.js
│       ├── dateTime.js
│       ├── distance.js
│       └── formatters.js
│
├── App.js                   # App entry point
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arun522/MedApp_ReactNative.git
   cd MedApp_ReactNative
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator, `i` for iOS simulator

## 📱 Screens Implemented

### Authentication Flow (6 screens)
1. **SplashScreen** - Initial loading screen
2. **LoginScreen** - Phone number entry
3. **OTPVerificationScreen** - OTP verification (test OTP: 123456)
4. **RoleSelectionScreen** - Choose Patient or Doctor
5. **PatientProfileSetupScreen** - Patient onboarding
6. **DoctorProfileSetupScreen** - Doctor onboarding

### Patient App (9 screens)
1. **HomeScreen** - Dashboard with quick actions
2. **DoctorSearchScreen** - Search and filter doctors
3. **DoctorDetailsScreen** - Doctor profile details
4. **BookAppointmentScreen** - Book appointment with calendar
5. **AppointmentsScreen** - View all appointments
6. **EmergencyRequestScreen** - Create emergency request
7. **MedicalRecordsScreen** - View medical records
8. **MedicationsScreen** - Active medications
9. **ProfileScreen** - Patient profile

### Doctor App (3 screens)
1. **DoctorHomeScreen** - Dashboard with stats
2. **DoctorAppointmentsScreen** - Manage appointments
3. **DoctorProfileScreen** - Doctor profile

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Success**: Green (#10B981)
- **Warning**: Amber (#F59E0B)
- **Danger**: Red (#EF4444)

### Components
All components follow a consistent design language with:
- Modern card-based layouts
- Smooth shadows and rounded corners
- Emoji icons for visual appeal
- Responsive spacing and typography
- Loading and empty states

