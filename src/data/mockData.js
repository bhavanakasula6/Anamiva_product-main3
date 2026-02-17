/**
 * Mock Data for MedApp
 * Contains comprehensive mock data for patients, doctors, appointments, etc.
 */

import {
  USER_ROLES,
  APPOINTMENT_TYPES,
  APPOINTMENT_STATUS,
  URGENCY_LEVELS,
  EMERGENCY_STATUS,
  RECORD_TYPES,
  RECORD_STATUS,
  MEDICATION_STATUS,
  BLOOD_GROUPS,
  GENDERS,
  SPECIALIZATIONS,
  DAYS_OF_WEEK,
  NOTIFICATION_TYPES,
  CONSENT_TYPES,
  CONSENT_STATUS,
  ACCESS_REQUEST_STATUS,
} from './constants';

// Helper function to generate random date
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random coordinates in a region
const randomCoordinate = (base, range) => {
  return base + (Math.random() - 0.5) * range;
};

// Common first and last names for generating realistic names
const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna',
  'Ishaan', 'Shaurya', 'Atharv', 'Advait', 'Pranav', 'Vihaan', 'Aarush',
  'Ananya', 'Diya', 'Aadhya', 'Saanvi', 'Anvi', 'Pari', 'Navya', 'Angel',
  'Anika', 'Sara', 'Prisha', 'Myra', 'Riya', 'Kiara', 'Avni',
  'Rahul', 'Rohan', 'Aryan', 'Karan', 'Varun', 'Dhruv', 'Kabir', 'Yash',
  'Neha', 'Priya', 'Pooja', 'Sneha', 'Kavya', 'Simran', 'Tanvi', 'Isha',
  'Amit', 'Raj', 'Vikram', 'Anil', 'Suresh', 'Ramesh'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Reddy', 'Shah',
  'Joshi', 'Desai', 'Agarwal', 'Mehta', 'Kapoor', 'Malhotra', 'Iyer',
  'Nair', 'Rao', 'Chopra', 'Bansal', 'Khanna', 'Jain', 'Bhatia', 'Sinha',
  'Pandey', 'Mishra', 'Das', 'Roy', 'Ghosh', 'Dutta', 'Sen'
];

const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kochi', 'Chandigarh'
];

const commonConditions = [
  'Hypertension', 'Type 2 Diabetes', 'Asthma', 'Migraine', 'Arthritis',
  'GERD', 'Anxiety Disorder', 'Hypothyroidism', 'Lower Back Pain',
  'High Cholesterol', 'Insomnia', 'Depression'
];

const commonAllergies = [
  'Penicillin', 'Pollen', 'Dust Mites', 'Shellfish', 'Peanuts',
  'Sulfa Drugs', 'Latex', 'Pet Dander', 'Eggs', 'Milk'
];

const medications = [
  'Metformin', 'Lisinopril', 'Atorvastatin', 'Levothyroxine', 'Amlodipine',
  'Metoprolol', 'Omeprazole', 'Losartan', 'Gabapentin', 'Sertraline',
  'Ibuprofen', 'Aspirin', 'Paracetamol', 'Amoxicillin', 'Ciprofloxacin'
];

// Generate 50+ Patients
export const MOCK_PATIENTS = Array.from({ length: 55 }, (_, i) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
  const age = 18 + Math.floor(Math.random() * 62); // 18-80 years
  const bloodGroup = BLOOD_GROUPS[Math.floor(Math.random() * BLOOD_GROUPS.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];

  // Generate random medical conditions (0-3)
  const numConditions = Math.floor(Math.random() * 4);
  const conditions = Array.from({ length: numConditions }, () =>
    commonConditions[Math.floor(Math.random() * commonConditions.length)]
  );

  // Generate random allergies (0-2)
  const numAllergies = Math.floor(Math.random() * 3);
  const allergies = Array.from({ length: numAllergies }, () =>
    commonAllergies[Math.floor(Math.random() * commonAllergies.length)]
  );

  return {
    id: `patient_${i + 1}`,
    role: USER_ROLES.PATIENT,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: `+91${9000000000 + i}`,
    phoneVerified: true,
    avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
    dateOfBirth: new Date(1944 + Math.floor(Math.random() * 60), Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)),
    age,
    gender,
    bloodGroup,
    address: {
      street: `${Math.floor(Math.random() * 999) + 1} ${['MG Road', 'Park Street', 'Main Road', 'Station Road'][Math.floor(Math.random() * 4)]}`,
      city,
      state: 'Maharashtra',
      pincode: `${400000 + Math.floor(Math.random() * 99999)}`,
      country: 'India',
    },
    location: {
      latitude: randomCoordinate(19.0760, 0.5),
      longitude: randomCoordinate(72.8777, 0.5),
    },
    emergencyContact: {
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      relationship: ['Spouse', 'Parent', 'Sibling', 'Friend'][Math.floor(Math.random() * 4)],
      phone: `+91${8000000000 + i}`,
    },
    medicalHistory: {
      conditions,
      allergies,
      previousSurgeries: Math.random() > 0.7 ? [
        {
          surgery: ['Appendectomy', 'Tonsillectomy', 'Hernia Repair', 'Gallbladder Removal'][Math.floor(Math.random() * 4)],
          date: randomDate(new Date(2015, 0, 1), new Date(2023, 0, 1)),
        }
      ] : [],
      familyHistory: Math.random() > 0.5 ? ['Diabetes', 'Heart Disease', 'Cancer', 'Hypertension'][Math.floor(Math.random() * 4)] : null,
    },
    createdAt: randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1)),
    updatedAt: new Date(),
  };
});

// Generate 30+ Doctors
export const MOCK_DOCTORS = Array.from({ length: 35 }, (_, i) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const gender = GENDERS[Math.floor(Math.random() * 2)]; // male or female
  const specialization = SPECIALIZATIONS[i % SPECIALIZATIONS.length];
  const city = cities[Math.floor(Math.random() * cities.length)];
  const experience = 5 + Math.floor(Math.random() * 30); // 5-35 years
  const rating = (3.5 + Math.random() * 1.5).toFixed(1); // 3.5-5.0
  const reviewCount = 50 + Math.floor(Math.random() * 950); // 50-1000 reviews
  const consultationFee = 300 + Math.floor(Math.random() * 1200); // ₹300-1500

  return {
    id: `doctor_${i + 1}`,
    role: USER_ROLES.DOCTOR,
    firstName,
    lastName,
    fullName: `Dr. ${firstName} ${lastName}`,
    email: `dr.${firstName.toLowerCase()}.${lastName.toLowerCase()}@medapp.com`,
    phone: `+91${7000000000 + i}`,
    phoneVerified: true,
    avatar: `https://i.pravatar.cc/150?img=${i + 20}`,
    gender,
    specialization,
    qualifications: ['MBBS', 'MD', 'DNB'][Math.floor(Math.random() * 3)],
    registrationNumber: `MCI${100000 + i}`,
    experience,
    rating: parseFloat(rating),
    reviewCount,
    consultationFee,
    bio: `Experienced ${specialization} with ${experience} years of practice. Specializing in comprehensive patient care and advanced treatments.`,
    address: {
      clinic: `${lastName} Clinic`,
      street: `${Math.floor(Math.random() * 999) + 1} ${['Medical Plaza', 'Healthcare Center', 'Wellness Hub', 'Clinic Building'][Math.floor(Math.random() * 4)]}`,
      city,
      state: 'Maharashtra',
      pincode: `${400000 + Math.floor(Math.random() * 99999)}`,
      country: 'India',
    },
    location: {
      latitude: randomCoordinate(19.0760, 0.5),
      longitude: randomCoordinate(72.8777, 0.5),
    },
    availability: {
      isOnline: Math.random() > 0.5,
      acceptingEmergency: Math.random() > 0.6,
      schedule: DAYS_OF_WEEK.map(day => ({
        day,
        available: Math.random() > 0.2,
        slots: [
          { start: '09:00', end: '12:00' },
          { start: '14:00', end: '18:00' },
        ],
      })),
    },
    languages: ['English', 'Hindi', 'Marathi'].slice(0, 1 + Math.floor(Math.random() * 3)),
    verified: true,
    totalPatients: Math.floor(Math.random() * 5000) + 500,
    totalAppointments: Math.floor(Math.random() * 10000) + 1000,
    createdAt: randomDate(new Date(2020, 0, 1), new Date(2023, 0, 1)),
    updatedAt: new Date(),
  };
});

// Generate 100+ Appointments
export const MOCK_APPOINTMENTS = (() => {
  const appointments = [];
  const now = new Date();

  for (let i = 0; i < 120; i++) {
    const patient = MOCK_PATIENTS[Math.floor(Math.random() * MOCK_PATIENTS.length)];
    const doctor = MOCK_DOCTORS[Math.floor(Math.random() * MOCK_DOCTORS.length)];
    const type = Object.values(APPOINTMENT_TYPES)[Math.floor(Math.random() * 2)]; // online or in-person

    // Generate dates: 40% past, 30% upcoming, 20% today, 10% pending
    let date;
    let status;

    if (i < 48) { // Past appointments
      date = randomDate(new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), now);
      status = APPOINTMENT_STATUS.COMPLETED;
    } else if (i < 84) { // Upcoming appointments
      date = randomDate(now, new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000));
      status = APPOINTMENT_STATUS.UPCOMING;
    } else if (i < 108) { // Today's appointments
      date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10 + Math.floor(Math.random() * 8), [0, 30][Math.floor(Math.random() * 2)]);
      status = APPOINTMENT_STATUS.UPCOMING;
    } else { // Pending appointments
      date = randomDate(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
      status = APPOINTMENT_STATUS.PENDING;
    }

    appointments.push({
      id: `appointment_${i + 1}`,
      patientId: patient.id,
      patient: {
        id: patient.id,
        name: patient.fullName,
        avatar: patient.avatar,
        age: patient.age,
        gender: patient.gender,
      },
      doctorId: doctor.id,
      doctor: {
        id: doctor.id,
        name: doctor.fullName,
        avatar: doctor.avatar,
        specialization: doctor.specialization,
        rating: doctor.rating,
      },
      date,
      time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
      duration: 30,
      type,
      status,
      fee: doctor.consultationFee,
      symptoms: status === APPOINTMENT_STATUS.COMPLETED || status === APPOINTMENT_STATUS.UPCOMING
        ? ['Fever', 'Headache', 'Fatigue', 'Cough', 'Chest Pain', 'Back Pain'][Math.floor(Math.random() * 6)]
        : null,
      notes: status === APPOINTMENT_STATUS.COMPLETED
        ? 'Patient examined. Treatment prescribed.'
        : null,
      prescriptionId: status === APPOINTMENT_STATUS.COMPLETED && Math.random() > 0.3
        ? `prescription_${i + 1}`
        : null,
      videoCallLink: type === APPOINTMENT_TYPES.ONLINE ? `https://meet.medapp.com/${i + 1}` : null,
      createdAt: new Date(date.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: date,
    });
  }

  return appointments;
})();

// Generate Medical Records
export const MOCK_MEDICAL_RECORDS = (() => {
  const records = [];

  // Generate prescriptions for completed appointments
  MOCK_APPOINTMENTS
    .filter(apt => apt.status === APPOINTMENT_STATUS.COMPLETED && apt.prescriptionId)
    .forEach((apt, i) => {
      records.push({
        id: apt.prescriptionId,
        patientId: apt.patientId,
        doctorId: apt.doctorId,
        appointmentId: apt.id,
        type: RECORD_TYPES.PRESCRIPTION,
        status: RECORD_STATUS.VERIFIED,
        title: 'Prescription',
        date: apt.date,
        medications: Array.from({ length: 1 + Math.floor(Math.random() * 4) }, (_, j) => ({
          id: `med_${i}_${j}`,
          name: medications[Math.floor(Math.random() * medications.length)],
          dosage: ['5mg', '10mg', '50mg', '100mg', '250mg', '500mg'][Math.floor(Math.random() * 6)],
          frequency: ['Once daily', 'Twice daily', 'Three times daily', 'As needed'][Math.floor(Math.random() * 4)],
          duration: `${7 + Math.floor(Math.random() * 21)} days`,
          instructions: 'Take after meals',
        })),
        diagnosis: ['Viral Fever', 'Bacterial Infection', 'Hypertension', 'Diabetes Management', 'Pain Management'][Math.floor(Math.random() * 5)],
        notes: 'Follow-up after course completion',
        images: [],
        createdAt: apt.date,
        updatedAt: apt.date,
      });
    });

  // Generate uploaded medical records for random patients
  for (let i = 0; i < 80; i++) {
    const patient = MOCK_PATIENTS[Math.floor(Math.random() * MOCK_PATIENTS.length)];
    const type = [
      RECORD_TYPES.LAB_REPORT,
      RECORD_TYPES.X_RAY,
      RECORD_TYPES.PRESCRIPTION,
      RECORD_TYPES.OTHER,
    ][Math.floor(Math.random() * 4)];

    const status =
      type === RECORD_TYPES.PRESCRIPTION
        ? RECORD_STATUS.PENDING
        : RECORD_STATUS.VERIFIED;

    const date = randomDate(new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000), new Date());

    records.push({
      id: `record_${i + 1}`,
      patientId: patient.id,
      doctorId: null,
      appointmentId: null,
      type,
      status,
      title: type === RECORD_TYPES.LAB_REPORT ? 'Blood Test Report' :
             type === RECORD_TYPES.X_RAY ? 'Chest X-Ray' :
             type === RECORD_TYPES.PRESCRIPTION ? 'External Prescription' :
             'Medical Document',
      date,
      images: [`https://picsum.photos/400/600?random=${i}`],
      notes: null,
      medications: [],
      createdAt: date,
      updatedAt: new Date(),
    });
  }

  return records;
})();

// Generate Active Medications
export const MOCK_ACTIVE_MEDICATIONS = (() => {
  const meds = [];

  MOCK_MEDICAL_RECORDS
    .filter(
      r =>
        r.type === RECORD_TYPES.PRESCRIPTION &&
        r.status === RECORD_STATUS.VERIFIED &&
        r.appointmentId &&
        r.medications?.length
    )
    .forEach(record => {
      record.medications.forEach((med, i) => {
        meds.push({
          id: `active_${record.id}_${i}`,
          patientId: record.patientId,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          status: MEDICATION_STATUS.ACTIVE,
          prescribedBy: record.doctorId,
          instructions: med.instructions,
        });
      });
    });

  return meds;
})();



// Generate Emergency Requests
export const MOCK_EMERGENCY_REQUESTS = (() => {
  const emergencies = [];
  const now = new Date();

  for (let i = 0; i < 25; i++) {
    const patient = MOCK_PATIENTS[Math.floor(Math.random() * MOCK_PATIENTS.length)];
    const doctor = Math.random() > 0.3 ? MOCK_DOCTORS[Math.floor(Math.random() * MOCK_DOCTORS.length)] : null;
    const urgency = Object.values(URGENCY_LEVELS)[Math.floor(Math.random() * 3)];
    const status = doctor ? [EMERGENCY_STATUS.ACCEPTED, EMERGENCY_STATUS.IN_PROGRESS, EMERGENCY_STATUS.COMPLETED][Math.floor(Math.random() * 3)] : EMERGENCY_STATUS.PENDING;
    const createdDate = randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now);

    emergencies.push({
      id: `emergency_${i + 1}`,
      patientId: patient.id,
      patient: {
        id: patient.id,
        name: patient.fullName,
        avatar: patient.avatar,
        age: patient.age,
        gender: patient.gender,
        phone: patient.phone,
      },
      doctorId: doctor?.id || null,
      doctor: doctor ? {
        id: doctor.id,
        name: doctor.fullName,
        avatar: doctor.avatar,
        specialization: doctor.specialization,
        phone: doctor.phone,
      } : null,
      urgency,
      status,
      symptoms: ['Severe chest pain', 'Difficulty breathing', 'High fever', 'Severe headache', 'Injury'][Math.floor(Math.random() * 5)],
      description: 'Urgent medical attention required',
      location: {
        latitude: patient.location.latitude,
        longitude: patient.location.longitude,
        address: `${patient.address.street}, ${patient.address.city}`,
      },
      estimatedArrival: status === EMERGENCY_STATUS.ACCEPTED || status === EMERGENCY_STATUS.IN_PROGRESS ?
        new Date(now.getTime() + (15 + Math.floor(Math.random() * 30)) * 60 * 1000) : null,
      createdAt: createdDate,
      acceptedAt: doctor && status !== EMERGENCY_STATUS.PENDING ? new Date(createdDate.getTime() + 2 * 60 * 1000) : null,
      completedAt: status === EMERGENCY_STATUS.COMPLETED ? new Date(createdDate.getTime() + 60 * 60 * 1000) : null,
    });
  }

  return emergencies;
})();

// Generate Chat Messages for Emergency Requests
export const MOCK_EMERGENCY_CHATS = (() => {
  const chats = {};

  MOCK_EMERGENCY_REQUESTS
    .filter(req => req.status !== EMERGENCY_STATUS.PENDING)
    .forEach(req => {
      const messages = [];
      const messageCount = 5 + Math.floor(Math.random() * 15);

      for (let i = 0; i < messageCount; i++) {
        const isPatient = i % 2 === 0;
        const timestamp = new Date(req.acceptedAt.getTime() + i * 2 * 60 * 1000);

        messages.push({
          id: `msg_${req.id}_${i}`,
          senderId: isPatient ? req.patientId : req.doctorId,
          senderName: isPatient ? req.patient.name : req.doctor.name,
          message: isPatient ?
            ['Still having severe pain', 'When will you arrive?', 'Need help urgently', 'Location shared'][i % 4] :
            ['On my way', 'Will reach in 10 mins', 'Please stay calm', 'Arrived at location'][i % 4],
          timestamp,
          read: true,
        });
      }

      chats[req.id] = messages;
    });

  return chats;
})();

// Generate Notifications
export const MOCK_NOTIFICATIONS = (() => {
  const notifications = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const type = Object.values(NOTIFICATION_TYPES)[Math.floor(Math.random() * 5)];
    const createdDate = randomDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now);

    let title, message;
    switch (type) {
      case NOTIFICATION_TYPES.APPOINTMENT:
        title = 'Appointment Reminder';
        message = 'You have an appointment tomorrow at 10:00 AM';
        break;
      case NOTIFICATION_TYPES.EMERGENCY:
        title = 'Emergency Request';
        message = 'New emergency request in your area';
        break;
      case NOTIFICATION_TYPES.PRESCRIPTION:
        title = 'Prescription Ready';
        message = 'Your prescription has been digitized';
        break;
      case NOTIFICATION_TYPES.MESSAGE:
        title = 'New Message';
        message = 'You have a new message from Dr. Sharma';
        break;
      default:
        title = 'System Update';
        message = 'MedApp has been updated to version 2.0';
    }

    notifications.push({
      id: `notification_${i + 1}`,
      userId: i % 2 === 0 ? MOCK_PATIENTS[i % MOCK_PATIENTS.length].id : MOCK_DOCTORS[i % MOCK_DOCTORS.length].id,
      type,
      title,
      message,
      read: Math.random() > 0.4,
      actionUrl: null,
      createdAt: createdDate,
    });
  }

  return notifications;
})();

// Generate Analytics Data for Doctors
export const MOCK_DOCTOR_ANALYTICS = (() => {
  const analytics = {};

  MOCK_DOCTORS.forEach(doctor => {
    const doctorAppointments = MOCK_APPOINTMENTS.filter(apt => apt.doctorId === doctor.id);

    analytics[doctor.id] = {
      today: {
        appointments: doctorAppointments.filter(apt => {
          const today = new Date();
          return apt.date.toDateString() === today.toDateString();
        }).length,
        revenue: doctorAppointments.filter(apt => {
          const today = new Date();
          return apt.date.toDateString() === today.toDateString() && apt.status === APPOINTMENT_STATUS.COMPLETED;
        }).reduce((sum, apt) => sum + apt.fee, 0),
        patients: new Set(doctorAppointments.filter(apt => {
          const today = new Date();
          return apt.date.toDateString() === today.toDateString();
        }).map(apt => apt.patientId)).size,
      },
      week: {
        appointments: doctorAppointments.filter(apt => {
          const weekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
          return apt.date >= weekAgo;
        }).length,
        revenue: doctorAppointments.filter(apt => {
          const weekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
          return apt.date >= weekAgo && apt.status === APPOINTMENT_STATUS.COMPLETED;
        }).reduce((sum, apt) => sum + apt.fee, 0),
        patients: new Set(doctorAppointments.filter(apt => {
          const weekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
          return apt.date >= weekAgo;
        }).map(apt => apt.patientId)).size,
      },
      month: {
        appointments: doctorAppointments.filter(apt => {
          const monthAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
          return apt.date >= monthAgo;
        }).length,
        revenue: doctorAppointments.filter(apt => {
          const monthAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
          return apt.date >= monthAgo && apt.status === APPOINTMENT_STATUS.COMPLETED;
        }).reduce((sum, apt) => sum + apt.fee, 0),
        patients: new Set(doctorAppointments.filter(apt => {
          const monthAgo = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
          return apt.date >= monthAgo;
        }).map(apt => apt.patientId)).size,
      },
      chartData: {
        appointments: Array.from({ length: 7 }, (_, i) => {
          const date = new Date(new Date().getTime() - (6 - i) * 24 * 60 * 60 * 1000);
          return {
            day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
            count: Math.floor(Math.random() * 10),
          };
        }),
        revenue: Array.from({ length: 7 }, (_, i) => {
          const date = new Date(new Date().getTime() - (6 - i) * 24 * 60 * 60 * 1000);
          return {
            day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
            amount: Math.floor(Math.random() * 5000),
          };
        }),
      },
      demographics: {
        ageGroups: [
          { range: '0-18', count: Math.floor(Math.random() * 20) },
          { range: '19-35', count: Math.floor(Math.random() * 50) },
          { range: '36-50', count: Math.floor(Math.random() * 40) },
          { range: '51-65', count: Math.floor(Math.random() * 30) },
          { range: '65+', count: Math.floor(Math.random() * 20) },
        ],
        gender: {
          male: Math.floor(Math.random() * 60) + 40,
          female: Math.floor(Math.random() * 60) + 40,
          other: Math.floor(Math.random() * 5),
        },
      },
    };
  });

  return analytics;
})();

// Generate Favorite Doctors for Patients
export const MOCK_FAVORITES = (() => {
  const favorites = {};

  MOCK_PATIENTS.forEach(patient => {
    const numFavorites = Math.floor(Math.random() * 5);
    favorites[patient.id] = Array.from({ length: numFavorites }, () =>
      MOCK_DOCTORS[Math.floor(Math.random() * MOCK_DOCTORS.length)].id
    );
  });

  return favorites;
})();

// Initial Access Requests (Doctor → Patient)
export const MOCK_ACCESS_REQUESTS = [
  {
    id: 'req_1',
    patientId: MOCK_PATIENTS[0].id,
    doctorId: MOCK_DOCTORS[0].id,
    appointmentId: MOCK_APPOINTMENTS[0].id,
    status: ACCESS_REQUEST_STATUS.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Initial Consents (Patient → Doctor)
export const MOCK_CONSENTS = [
  {
    id: 'consent_1',
    patientId: MOCK_PATIENTS[1].id,
    doctorId: MOCK_DOCTORS[1].id,
    appointmentId: null,
    type: CONSENT_TYPES.EXTENDED,
    status: CONSENT_STATUS.ACTIVE,
    createdAt: new Date(),
    revokedAt: null,
    expiredAt: null,
  },
  {
    id: 'consent_2',
    patientId: MOCK_PATIENTS[0].id,
    doctorId: MOCK_DOCTORS[0].id,
    appointmentId: MOCK_APPOINTMENTS[0].id,
    type: CONSENT_TYPES.CONSULTATION,
    status: CONSENT_STATUS.ACTIVE,
    createdAt: new Date(),
    revokedAt: null,
    expiredAt: null,
  },
];


// Export all mock data
export default {
  MOCK_PATIENTS,
  MOCK_DOCTORS,
  MOCK_APPOINTMENTS,
  MOCK_MEDICAL_RECORDS,
  MOCK_ACTIVE_MEDICATIONS,
  MOCK_EMERGENCY_REQUESTS,
  MOCK_EMERGENCY_CHATS,
  MOCK_NOTIFICATIONS,
  MOCK_DOCTOR_ANALYTICS,
  MOCK_FAVORITES,
  MOCK_CONSENTS,
  MOCK_ACCESS_REQUESTS,
};
