const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');

// Robust helper to resolve name from user object
const getSafeName = (user) => {
  if (!user) return 'Unknown';

  // Check various name fields, ignoring literal "undefined" strings
  const fullName = (user.fullName && user.fullName !== 'undefined' && user.fullName !== '') ? user.fullName : null;
  const name = (user.name && user.name !== 'undefined' && user.name !== '') ? user.name : null;
  const firstName = (user.firstName && user.firstName !== 'undefined' && user.firstName !== '') ? user.firstName : null;
  const lastName = (user.lastName && user.lastName !== 'undefined' && user.lastName !== '') ? user.lastName : null;

  if (fullName) return fullName;
  if (name) return name;
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;

  return 'Unknown';
};

// Robust helper to calculate age
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth || dateOfBirth === 'undefined') return '-';
  try {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) return '-';
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age >= 0 ? age.toString() : '-';
  } catch {
    return '-';
  }
};

// Transform appointment for frontend
const transformAppointment = (apt) => {
  const aptObj = apt.toObject ? apt.toObject() : apt;

  return {
    ...aptObj,
    id: aptObj._id.toString(),
    patientId: aptObj.patientId?._id?.toString() || aptObj.patientId?.toString(),
    doctorId: aptObj.doctorId?._id?.toString() || aptObj.doctorId?.toString(),
    // Map patientId -> patient for frontend
    patient: aptObj.patientId ? {
      id: aptObj.patientId._id?.toString() || aptObj.patientId.toString(),
      name: getSafeName(aptObj.patientId),
      avatar: aptObj.patientId.avatar || null,
      age: calculateAge(aptObj.patientId.dateOfBirth),
      gender: (aptObj.patientId.gender && aptObj.patientId.gender !== 'undefined') ? aptObj.patientId.gender : '-',
      phone: aptObj.patientId.phone || aptObj.patientId.phoneNumber,
    } : null,
    // Map doctorId -> doctor for frontend
    doctor: aptObj.doctorId ? {
      id: aptObj.doctorId._id?.toString() || aptObj.doctorId.toString(),
      name: getSafeName(aptObj.doctorId.userId || aptObj.doctorId), // Look in populated userId or Doctor itself
      avatar: aptObj.doctorId.avatar || aptObj.doctorId.userId?.avatar || null,
      specialization: aptObj.doctorId.specialization || aptObj.doctorId.speciality || null,
    } : null,
  };
};

/* =========================
   BOOK APPOINTMENT
========================= */
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, type, symptoms } = req.body;

    const existing = await Appointment.findOne({ doctorId, date, time });
    if (existing) return res.status(409).json({ success: false, message: 'Time slot already booked' });

    const appointment = await Appointment.create({
      patientId: req.user.id,
      doctorId,
      date,
      time,
      type,
      symptoms,
    });

    res.status(201).json({ success: true, appointment, message: 'Appointment booked successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET ALL APPOINTMENTS
========================= */
exports.getAppointments = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "patient") {
      filter.patientId = req.user.id;
    }
    else if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (doctorProfile) {
        filter.doctorId = doctorProfile._id;
      } else {
        return res.json({
          success: true,
          appointments: [],
          pagination: { page: 1, limit: 20, total: 0, pages: 0 }
        });
      }
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .populate('doctorId')
      .populate('patientId')
      .sort({ date: -1 });

    const transformedAppointments = appointments.map(apt => transformAppointment(apt));

    res.json({
      success: true,
      appointments: transformedAppointments,
      pagination: {
        page: 1,
        limit: 20,
        total: transformedAppointments.length,
        pages: transformedAppointments.length ? 1 : 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET APPOINTMENT BY ID
========================= */
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('doctorId')
      .populate('patientId');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    res.json({
      success: true,
      appointment: transformAppointment(appointment)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE STATUS (Doctor Only)
========================= */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // For doctors, compare against their doctor profile ID
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (!doctorProfile || appointment.doctorId.toString() !== doctorProfile._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
    } else {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ success: true, appointment: transformAppointment(appointment) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   CANCEL APPOINTMENT
========================= */
exports.cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (appointment.patientId.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized' });

    appointment.status = 'cancelled';
    appointment.cancelReason = reason;
    await appointment.save();

    res.json({ success: true, appointment: transformAppointment(appointment) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   RESCHEDULE APPOINTMENT
========================= */
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { date, time } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (appointment.patientId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    appointment.date = date;
    appointment.time = time;
    appointment.status = 'upcoming';
    await appointment.save();

    res.json({ success: true, appointment: transformAppointment(appointment) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   ADD CLINICAL NOTES
========================= */
exports.addNotes = async (req, res) => {
  try {
    const { notes, diagnosis } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const doctorProfile = await Doctor.findOne({ userId: req.user.id });
    if (!doctorProfile || appointment.doctorId.toString() !== doctorProfile._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });

    appointment.notes = notes;
    appointment.diagnosis = diagnosis;
    await appointment.save();

    res.json({ success: true, appointment: transformAppointment(appointment) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
