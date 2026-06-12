const Consent = require("../models/consent");
const AccessRequest = require("../models/accessrequest");
const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");

const resolveDoctorId = async (doctorId) => {
  if (!doctorId) return doctorId;
  const byProfileId = await Doctor.findById(doctorId);
  if (byProfileId) return byProfileId._id;

  const byUserId = await Doctor.findOne({ userId: doctorId });
  return byUserId?._id || doctorId;
};

/* =========================
   GET CONSENTS (Patient)
========================= */
exports.getConsents = async (req, res) => {
  try {
    const filter = { status: "active" };

    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (!doctorProfile) {
        return res.json({ success: true, consents: [] });
      }
      filter.doctorId = doctorProfile._id;
    } else {
      filter.patientId = req.user.id;
    }

    const consents = await Consent.find(filter)
      .populate("patientId", "name fullName firstName lastName dateOfBirth gender avatar profilePicture")
      .populate({ path: "doctorId", populate: { path: "userId", select: "name fullName" } })
      .populate("appointmentId");

    res.json({ success: true, consents });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   CREATE CONSENT (Patient grants)
========================= */
exports.createConsent = async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ success: false, message: "Only patients can share medical history" });
    }

    const { appointmentId, type = "consultation" } = req.body;
    const doctorId = await resolveDoctorId(req.body.doctorId);

    if (type === "consultation") {
      const appointment = await Appointment.findById(appointmentId);
      if (
        !appointment ||
        appointment.patientId.toString() !== req.user.id ||
        appointment.doctorId.toString() !== doctorId.toString() ||
        appointment.status !== "upcoming"
      ) {
        return res.status(400).json({ success: false, message: "Consultation access requires an upcoming appointment" });
      }
    }

    // Check if consent already exists
    const existing = await Consent.findOne({
      patientId: req.user.id,
      doctorId,
      appointmentId: appointmentId || undefined,
      status: "active",
    });

    if (existing) {
      return res.json({ success: true, consent: existing, message: "Consent already exists" });
    }

    const consent = await Consent.create({
      patientId: req.user.id,
      doctorId,
      appointmentId,
      type,
      expiresAt: type === "consultation"
        ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    // Notify doctor via socket
    try {
      const { getIO } = require("../sockets/socket");
      const io = getIO();
      const doctorProfile = await Doctor.findById(doctorId);
      if (doctorProfile) {
        io.to(`user_${doctorProfile.userId.toString()}`).emit("consent-granted", {
          consentId: consent._id,
          patientId: req.user.id,
          appointmentId,
          type,
        });
      }
    } catch (socketErr) {
      console.warn("Socket emit failed:", socketErr.message);
    }

    res.status(201).json({ success: true, consent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   REVOKE CONSENT
========================= */
exports.revokeConsent = async (req, res) => {
  try {
    const consent = await Consent.findById(req.params.consentId);
    if (!consent) return res.status(404).json({ success: false, message: "Consent not found" });
    if (consent.patientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    consent.status = "revoked";
    consent.revokedAt = new Date();
    await consent.save();

    try {
      const { getIO } = require("../sockets/socket");
      const doctorProfile = await Doctor.findById(consent.doctorId);
      if (doctorProfile) {
        getIO().to(`user_${doctorProfile.userId.toString()}`).emit("consent-revoked", {
          consentId: consent._id,
          patientId: consent.patientId,
          appointmentId: consent.appointmentId,
          type: consent.type,
        });
      }
      getIO().to(`user_${consent.patientId.toString()}`).emit("consent-revoked", {
        consentId: consent._id,
        doctorId: consent.doctorId,
        appointmentId: consent.appointmentId,
        type: consent.type,
      });
    } catch (socketErr) {
      console.warn("Socket emit failed:", socketErr.message);
    }

    res.json({ success: true, consent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   REVOKE EXTENDED CONSENT
========================= */
exports.revokeExtendedConsent = async (req, res) => {
  try {
    const doctorId = await resolveDoctorId(req.body?.doctorId || req.query.doctorId);
    const consent = await Consent.findOne({
      patientId: req.user.id,
      doctorId,
      type: "extended",
      status: "active",
    });

    if (!consent) return res.status(404).json({ success: false, message: "No active extended consent found" });

    consent.status = "revoked";
    consent.revokedAt = new Date();
    await consent.save();

    try {
      const { getIO } = require("../sockets/socket");
      const doctorProfile = await Doctor.findById(consent.doctorId);
      if (doctorProfile) {
        getIO().to(`user_${doctorProfile.userId.toString()}`).emit("consent-revoked", {
          consentId: consent._id,
          patientId: consent.patientId,
          type: consent.type,
        });
      }
      getIO().to(`user_${consent.patientId.toString()}`).emit("consent-revoked", {
        consentId: consent._id,
        doctorId: consent.doctorId,
        type: consent.type,
      });
    } catch (socketErr) {
      console.warn("Socket emit failed:", socketErr.message);
    }

    res.json({ success: true, consent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   CHECK ACCESS STATUS
========================= */
exports.checkAccess = async (req, res) => {
  try {
    const { patientId, appointmentId } = req.query;
    const doctorId = await resolveDoctorId(req.query.doctorId);
    const pid = patientId || req.user.id;

    const filter = { patientId: pid, status: "active" };
    if (doctorId) filter.doctorId = doctorId;
    if (appointmentId) {
      filter.$or = [
        { type: "extended" },
        { type: "consultation", appointmentId },
      ];
    }

    const consent = await Consent.findOne(filter);

    if (consent) {
      // Check if expired
      if (consent.expiresAt && new Date() > consent.expiresAt) {
        consent.status = "expired";
        await consent.save();
        return res.json({ success: true, status: "NO_ACCESS", type: null });
      }
      return res.json({ success: true, status: "GRANTED", type: consent.type, consentId: consent._id });
    }

    // Check if there's a pending request
    const pendingRequest = await AccessRequest.findOne({
      patientId: pid,
      ...(doctorId ? { doctorId } : {}),
      ...(appointmentId ? { appointmentId } : {}),
      status: "pending",
    });

    if (pendingRequest) {
      return res.json({ success: true, status: "PENDING", type: null, requestId: pendingRequest._id });
    }

    const deniedRequest = await AccessRequest.findOne({
      patientId: pid,
      ...(doctorId ? { doctorId } : {}),
      ...(appointmentId ? { appointmentId } : {}),
      status: "denied",
    }).sort({ respondedAt: -1, updatedAt: -1 });

    if (deniedRequest) {
      return res.json({ success: true, status: "DENIED", type: null, requestId: deniedRequest._id });
    }

    res.json({ success: true, status: "NO_ACCESS", type: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   REQUEST ACCESS (Doctor requests)
========================= */
exports.requestAccess = async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ success: false, message: "Only doctors can request medical history access" });
    }

    const { patientId, appointmentId } = req.body;

    const doctorProfile = await Doctor.findOne({ userId: req.user.id });
    if (!doctorProfile) return res.status(400).json({ success: false, message: "Doctor profile not found" });

    const appointment = await Appointment.findById(appointmentId);
    if (
      !appointment ||
      appointment.patientId.toString() !== patientId ||
      appointment.doctorId.toString() !== doctorProfile._id.toString() ||
      appointment.status !== "upcoming"
    ) {
      return res.status(400).json({
        success: false,
        error: "APPOINTMENT_NOT_UPCOMING",
        message: "Access can only be requested for an upcoming appointment",
      });
    }

    // Check for existing pending request
    const existing = await AccessRequest.findOne({
      doctorId: doctorProfile._id,
      patientId,
      appointmentId,
      status: "pending",
    });

    if (existing) {
      return res.json({ success: true, request: existing, message: "Request already pending" });
    }

    const request = await AccessRequest.create({
      doctorId: doctorProfile._id,
      doctorUserId: req.user.id,
      patientId,
      appointmentId,
    });

    // Notify patient via socket
    try {
      const { getIO } = require("../sockets/socket");
      const io = getIO();
      io.to(`user_${patientId}`).emit("consultation-access-requested", {
        requestId: request._id,
        doctorId: doctorProfile._id,
        doctorName: req.user.name || "Doctor",
        appointmentId,
      });
    } catch (socketErr) {
      console.warn("Socket emit failed:", socketErr.message);
    }

    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET PENDING REQUESTS (Patient)
========================= */
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await AccessRequest.find({ patientId: req.user.id, status: "pending" })
      .populate({ path: "doctorId", populate: { path: "userId", select: "name fullName" } })
      .populate("appointmentId");

    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   APPROVE REQUEST (Patient)
========================= */
exports.approveRequest = async (req, res) => {
  try {
    const request = await AccessRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    if (request.patientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.status = "approved";
    request.respondedAt = new Date();
    await request.save();

    // Auto-create consent
    const consent = await Consent.create({
      patientId: req.user.id,
      doctorId: request.doctorId,
      appointmentId: request.appointmentId,
      type: "consultation",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Notify doctor via socket
    try {
      const { getIO } = require("../sockets/socket");
      const io = getIO();
      io.to(`user_${request.doctorUserId.toString()}`).emit("access-request-approved", {
        requestId: request._id,
        patientId: req.user.id,
        appointmentId: request.appointmentId,
      });
    } catch (socketErr) {
      console.warn("Socket emit failed:", socketErr.message);
    }

    res.json({ success: true, request, consent });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   CANCEL REQUEST (Doctor)
========================= */
exports.cancelRequest = async (req, res) => {
  try {
    const request = await AccessRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });

    const doctorProfile = await Doctor.findOne({ userId: req.user.id });
    if (!doctorProfile || request.doctorId.toString() !== doctorProfile._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ success: false, message: "Only pending requests can be cancelled" });
    }

    request.status = "cancelled";
    request.respondedAt = new Date();
    await request.save();

    try {
      const { getIO } = require("../sockets/socket");
      getIO().to(`user_${request.patientId.toString()}`).emit("access-request-cancelled", {
        requestId: request._id,
        appointmentId: request.appointmentId,
      });
    } catch (socketErr) {
      console.warn("Socket emit failed:", socketErr.message);
    }

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   DENY REQUEST (Patient)
========================= */
exports.denyRequest = async (req, res) => {
  try {
    const request = await AccessRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    if (request.patientId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.status = "denied";
    request.respondedAt = new Date();
    await request.save();

    try {
      const { getIO } = require("../sockets/socket");
      getIO().to(`user_${request.doctorUserId.toString()}`).emit("access-request-denied", {
        requestId: request._id,
        patientId: req.user.id,
        appointmentId: request.appointmentId,
      });
    } catch (socketErr) {
      console.warn("Socket emit failed:", socketErr.message);
    }

    res.json({ success: true, request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
