# MedApp Backend API Requirements

Hey Backend Team! This document outlines what we need for the MedApp telemedicine platform. It's a React Native app connecting patients with doctors for consultations, emergencies, and medical record management.

---

## What We're Building

A telemedicine app with two types of users:
- **Patients**: Book appointments, find doctors, get emergency help, manage health records
- **Doctors**: Handle appointments, respond to emergencies, review prescriptions, track earnings

**Base URLs:**
- Development: `http://localhost:4000/api`
- Production: `https://api.medapp.com/api`

---

## The Main Entities

### Users (Patients & Doctors)

Both types share basics like name, phone, email, location. Phone verification via OTP is mandatory.

**Patient specifics:**
- Date of birth, age, blood group, gender
- Medical history (conditions, allergies, surgeries)
- Emergency contact info
- Address and GPS coordinates

**Doctor specifics:**
- Specialization (Cardiologist, Dermatologist, etc.)
- Qualifications (MBBS, MD, etc.)
- Medical registration number
- Experience years, consultation fee
- Rating and review count
- Availability schedule (days, time slots)
- Online/offline status
- Emergency acceptance toggle

### Appointments

Links a patient to a doctor for a consultation.
- Date and time (30-minute slots)
- Type: online (video call) or in-person
- Status: pending → upcoming → completed/cancelled
- Patient symptoms and doctor's notes
- Optional diagnosis and prescription

### Emergency Requests

When patients need immediate help.
- Urgency level: high/medium/low
- Patient location (GPS + address)
- Symptoms description
- Status: pending → accepted → in-progress → completed
- Chat messages between patient and assigned doctor
- Estimated doctor arrival time

### Medical Records

Patient's health documents.
- Type: prescription, lab report, X-ray, other
- Images/PDFs (max 5MB each, up to 10 files)
- Status: verified, pending, transcribed
- Optional medications list with dosage details
- Can be linked to appointments

### Active Medications

Current medicines patients are taking.
- Name, dosage, frequency, duration
- Start and end dates
- Prescribing doctor
- Reminder settings (time-based notifications)

### Notifications

In-app alerts for both user types.
- Types: appointment, emergency, prescription, message, system
- Read/unread status
- Optional action URLs (deep links)

### Analytics (Doctors Only)

Dashboard stats for doctors.
- Today/week/month counts: appointments, revenue, patients
- Charts for trends
- Patient demographics (age groups, gender)

---

## Authentication Flow

We use OTP-based phone authentication (no passwords).

**For New Users:**
1. User enters phone number → `POST /api/auth/send-otp`
2. SMS with OTP sent
3. User enters OTP → `POST /api/auth/verify-otp`
4. If new: Backend returns `isNewUser: true` with temp token
5. User picks role (patient/doctor) → `POST /api/auth/select-role`
6. User fills profile → `POST /api/auth/complete-profile`
7. Backend returns full user object + JWT token

**For Existing Users:**
1. User enters phone → `POST /api/auth/send-otp`
2. User enters OTP → `POST /api/auth/verify-otp`
3. Backend returns user object + JWT token

**Important:**
- Rate limit OTP requests (max 3 per hour per phone)
- JWT tokens should last 30 days
- Include userId, role, phoneVerified in token payload
- Use `Authorization: Bearer {token}` header for protected routes

---

## API Endpoints We Need

### Authentication (7 endpoints)

1. **POST /api/auth/send-otp** - Send OTP to phone
2. **POST /api/auth/verify-otp** - Verify OTP and login/register
3. **POST /api/auth/select-role** - New user selects patient/doctor
4. **POST /api/auth/complete-profile** - Complete registration with profile details
5. **GET /api/auth/me** - Get current user info
6. **POST /api/auth/logout** - Logout
7. **PUT /api/auth/profile** - Update profile

### Doctors (5 endpoints)

1. **GET /api/doctors** - Search doctors (with filters: specialization, location, availability)
2. **GET /api/doctors/:doctorId** - Get doctor details
3. **GET /api/doctors/:doctorId/availability** - Get available time slots for a date
4. **POST /api/doctors/:doctorId/favorite** - Patient adds doctor to favorites
5. **GET /api/doctors/favorites** - Patient's favorite doctors list

### Appointments (7 endpoints)

1. **POST /api/appointments** - Book new appointment
2. **GET /api/appointments** - List appointments (filtered by status, date range)
3. **GET /api/appointments/:appointmentId** - Get single appointment details
4. **PATCH /api/appointments/:appointmentId/status** - Update status (doctor only)
5. **POST /api/appointments/:appointmentId/cancel** - Cancel appointment
6. **PATCH /api/appointments/:appointmentId/reschedule** - Change date/time
7. **POST /api/appointments/:appointmentId/notes** - Doctor adds clinical notes

### Emergency (6 endpoints)

1. **POST /api/emergency/request** - Patient creates emergency request
2. **GET /api/emergency/nearby** - Doctor sees nearby emergencies (location-based)
3. **POST /api/emergency/:requestId/accept** - Doctor accepts emergency
4. **PATCH /api/emergency/:requestId/status** - Update emergency status
5. **GET /api/emergency/:requestId/messages** - Get chat messages
6. **POST /api/emergency/:requestId/messages** - Send chat message

### Medical Records (4 endpoints)

1. **POST /api/medical-records** - Patient uploads record (multipart/form-data)
2. **GET /api/medical-records** - List records (patients see own, doctors see patient's during appointments)
3. **GET /api/medical-records/pending** - Doctor gets pending prescriptions to transcribe
4. **POST /api/medical-records/:recordId/transcribe** - Doctor transcribes prescription from image

### Medications (2 endpoints)

1. **GET /api/medications/active** - Get active medications
2. **PATCH /api/medications/:medicationId/reminder** - Update reminder settings

### Notifications (3 endpoints)

1. **GET /api/notifications** - List notifications (with unread count)
2. **PATCH /api/notifications/:notificationId/read** - Mark as read
3. **POST /api/notifications/read-all** - Mark all as read

### Analytics (1 endpoint)

1. **GET /api/analytics** - Doctor gets stats (query param: today/week/month)

**Total: 35 endpoints**

---

## Important Business Rules

### Appointments
- Slots are 30 minutes each
- Can book up to 30 days ahead
- Must cancel 24+ hours before (else no refund)
- Online appointments get auto-generated video links
- Doctors mark appointments as completed

### Emergency
- Patient can have only ONE active emergency at a time
- Search radius: 5km (expand to 10km if needed)
- Only ONE doctor can accept (first-come, first-served)
- Chat unlocks after doctor accepts
- If no response in 10 mins, tell patient to call 911

### Medical Records
- Max 5MB per image/PDF
- Formats: JPEG, PNG, PDF
- Max 10 files per record
- Any verified doctor can transcribe pending prescriptions
- Transcription creates active medications automatically

### Medications
- Auto-created from transcribed prescriptions
- Auto-mark completed when end date passes
- Push notifications for reminders (if enabled)

### Doctor Availability
- Doctors set recurring weekly schedules
- 30-minute slots during their availability windows
- Can toggle emergency acceptance on/off
- Can temporarily block specific dates

---

## Data Access Rules

**Patients can:**
- Read/update own profile
- View all doctors (search/browse)
- Create/view/cancel own appointments
- Create/view own emergency requests
- Upload/view own medical records
- View/manage own medications
- View own notifications

**Doctors can:**
- Read/update own profile
- View patient profiles during appointments/emergencies
- View/update assigned appointments
- View nearby emergency requests
- Accept/update assigned emergencies
- View patient medical records during active appointments
- Transcribe any pending prescription
- View patient medications during appointments
- View own analytics

---

## File Uploads

**What needs uploads:**
- Profile avatars
- Medical record images (prescriptions, reports, X-rays)

**Requirements:**
- Max size: 5MB per file
- Formats: JPEG, PNG, PDF
- Max 10 files per medical record
- Use cloud storage (S3, Cloudinary, etc.)
- Return public URLs in responses

**Optional enhancements:**
- Compress images to save space
- Resize avatars to 300x300px
- Generate thumbnails for records

---

## Real-Time Features (Critical)

### Emergency Chat
We need real-time messaging between patient and doctor during emergencies. Options:
- **WebSockets** (preferred - low latency, bidirectional)
- **Firebase Realtime Database** (easier setup)
- **Server-Sent Events** (one-way, simpler than WebSocket)

### Push Notifications
Use Firebase Cloud Messaging (FCM). Send notifications for:
- Appointment booked/cancelled
- Appointment reminders (24h and 1h before)
- Emergency accepted
- New emergency chat message
- Prescription ready
- General system alerts

Store device tokens in user records to enable this.

---

## Search & Filtering

### Doctor Search (GET /api/doctors)
Support these query params:
- `query` - Search text (name, specialization)
- `specialization` - Filter by specialty
- `availableNow` - Boolean, doctors online now
- `acceptingEmergency` - Boolean, accepting emergencies
- `latitude` & `longitude` - For distance calculation
- `radius` - Search radius in km
- `sortBy` - rating or distance
- `page` & `limit` - Pagination

Return doctors with distance (if location provided) and availability status.

### Appointments Filter (GET /api/appointments)
Support these query params:
- `status` - pending/upcoming/completed/cancelled
- `startDate` & `endDate` - Date range
- `page` & `limit` - Pagination

Patients see their appointments, doctors see where they're the doctor.

---

## Response Format

**Success:**
```json
{
  "success": true,
  "data": { /* or array */ },
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly message",
    "details": { /* optional field-level errors */ }
  }
}
```

**Common HTTP codes:**
- 200 - Success
- 201 - Created
- 400 - Bad request / validation error
- 401 - Not authenticated
- 403 - Not authorized
- 404 - Not found
- 409 - Conflict (e.g., slot already booked)
- 429 - Rate limit exceeded
- 500 - Server error

---

## Important Constants

### Specializations
General Physician, Cardiologist, Dermatologist, Pediatrician, Orthopedic, Neurologist, ENT, Gynecologist, Psychiatrist, Dentist, Ophthalmologist, Urologist, Gastroenterologist, Endocrinologist, Pulmonologist

### Appointment Status
pending, upcoming, completed, cancelled

### Emergency Urgency
high, medium, low

### Emergency Status
pending, accepted, in-progress, completed, cancelled

### Medical Record Types
prescription, lab-report, x-ray, other

### Record Status
verified, pending, transcribed, rejected

### Blood Groups
A+, A-, B+, B-, AB+, AB-, O+, O-

### Genders
male, female, other

---

## Implementation Priority

### Phase 1 - MVP (Start Here)
1. Authentication (OTP, registration, profile)
2. Doctor search and details
3. Appointment booking and management
4. Basic notifications

**~15 endpoints**

### Phase 2 - Core Features
1. Emergency services with chat
2. Medical records upload/view
3. Active medications
4. Push notifications setup

**~12 endpoints**

### Phase 3 - Nice to Have
1. Prescription transcription feature
2. Doctor analytics dashboard
3. Favorites, rescheduling, ratings
4. Advanced search

**~8 endpoints**

---

## Technical Recommendations

### Database
Use **PostgreSQL with PostGIS** for geospatial queries (doctor/emergency location searches).

**Index these:**
- userId, doctorId, patientId
- Date and time fields
- Location coordinates (geospatial index)
- Doctor names/specializations (full-text search)

### Security
- Encrypt medical data at rest
- Use HTTPS only
- Validate all inputs (prevent SQL injection, XSS)
- Rate limit OTP endpoint aggressively
- Consider HIPAA compliance if applicable
- Log all medical record access (audit trail)

### Performance
- Paginate all lists (20 items per page)
- Cache doctor profiles and availability
- Use CDN for images
- Optimize location queries with proper indexing
- Avoid N+1 queries

### Monitoring
- Set up error tracking (Sentry)
- Monitor API response times
- Alert on high error rates
- Log critical operations

---

## Sample Data Scale

Our mock data includes:
- 55 patients
- 35 doctors across 15 specializations
- 120 appointments (mixed statuses)
- 80+ medical records
- 25 emergency requests
- 50 notifications

This gives you an idea of the data volumes for testing.

---

## Example Request/Response Flows

### Booking an Appointment
```
1. Patient searches doctors: GET /api/doctors?specialization=Cardiologist&latitude=19.0760&longitude=72.8777
2. Patient views doctor: GET /api/doctors/doctor_1
3. Patient checks slots: GET /api/doctors/doctor_1/availability?date=2024-01-15
4. Patient books: POST /api/appointments
   Body: { doctorId, date, time, type: "online", symptoms: "..." }
5. Backend creates appointment, generates video link, sends notifications
```

### Emergency Flow
```
1. Patient creates request: POST /api/emergency/request
   Body: { urgency: "high", symptoms: "...", location: {...} }
2. Backend notifies nearby doctors
3. Doctor views: GET /api/emergency/nearby?latitude=19.0760&longitude=72.8777
4. Doctor accepts: POST /api/emergency/request_1/accept
   Body: { estimatedArrival: "2024-01-15T10:30:00Z" }
5. Backend updates status, notifies patient, unlocks chat
6. Both can chat: POST /api/emergency/request_1/messages
```

### Medical Record Upload
```
1. Patient uploads: POST /api/medical-records
   Form data: { type: "prescription", title: "...", date: "...", images: [File, File] }
2. Backend validates files, uploads to cloud storage
3. Backend creates record with image URLs
4. Record appears in pending queue for transcription
5. Doctor transcribes: POST /api/medical-records/record_1/transcribe
   Body: { medications: [...], diagnosis: "...", notes: "..." }
6. Backend updates status, creates active medications, notifies patient
```

---

## Quick Endpoint Reference

**Authentication:** send-otp, verify-otp, select-role, complete-profile, me, logout, profile

**Doctors:** search, details, availability, favorite, favorites-list

**Appointments:** create, list, details, update-status, cancel, reschedule, add-notes

**Emergency:** create-request, nearby, accept, update-status, messages-list, send-message

**Medical Records:** upload, list, pending, transcribe

**Medications:** active-list, update-reminder

**Notifications:** list, mark-read, mark-all-read

**Analytics:** get-stats

---


