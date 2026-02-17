const MedicalRecord = require('../models/medicalrecord');

/**
 * Robustly extract a name from a user object
 */
const getSafeName = (user) => {
  if (!user) return 'Unknown';

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

/**
 * Transform medical record for frontend
 */
const transformMedicalRecord = (rec) => {
  const recObj = rec.toObject ? rec.toObject() : rec;

  return {
    ...recObj,
    id: recObj._id.toString(),
    patient: recObj.patientId ? {
      id: recObj.patientId._id?.toString() || recObj.patientId.toString(),
      name: getSafeName(recObj.patientId),
      avatar: recObj.patientId.avatar || null,
    } : null,
    doctor: recObj.doctorId ? {
      id: recObj.doctorId._id?.toString() || recObj.doctorId.toString(),
      name: getSafeName(recObj.doctorId.userId || recObj.doctorId),
      avatar: recObj.doctorId.avatar || recObj.doctorId.userId?.avatar || null,
      specialization: recObj.doctorId.specialization || recObj.doctorId.speciality || null,
    } : null,
  };
};

/* =========================
   CREATE MEDICAL RECORD
========================= */
exports.createMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.create({
      patientId: req.user.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      record: transformMedicalRecord(record)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET MEDICAL RECORDS (Patient's own)
========================= */
exports.getMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user.id })
      .populate({
        path: 'doctorId',
        populate: { path: 'userId' }
      })
      .sort({ createdAt: -1 });

    const transformedRecords = records.map(rec => transformMedicalRecord(rec));

    res.json({ success: true, records: transformedRecords });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   GET PENDING RECORDS (Doctor - for verification)
========================= */
exports.getPendingRecords = async (req, res) => {
  try {
    const status = req.query.status || 'pending';

    const records = await MedicalRecord.find({ status })
      .populate('patientId')
      .populate({
        path: 'doctorId',
        populate: { path: 'userId' }
      })
      .sort({ createdAt: -1 });

    const transformedRecords = records.map(rec => transformMedicalRecord(rec));

    res.json({ success: true, records: transformedRecords });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   VERIFY RECORD (Doctor only)
========================= */
exports.verifyRecord = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Only doctors can verify records' });
    }

    const record = await MedicalRecord.findById(req.params.recordId);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record.status = 'approved';
    record.doctorId = req.user.id;
    await record.save();

    const updatedRecord = await MedicalRecord.findById(record._id)
      .populate({
        path: 'doctorId',
        populate: { path: 'userId' }
      })
      .populate('patientId');

    res.json({
      success: true,
      record: transformMedicalRecord(updatedRecord)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   REJECT RECORD (Doctor only)
========================= */
exports.rejectRecord = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Only doctors can reject records' });
    }

    const record = await MedicalRecord.findById(req.params.recordId);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    record.status = 'rejected';
    record.rejectionReason = req.body.reason || '';
    record.doctorId = req.user.id;
    await record.save();

    const updatedRecord = await MedicalRecord.findById(record._id)
      .populate({
        path: 'doctorId',
        populate: { path: 'userId' }
      })
      .populate('patientId');

    res.json({
      success: true,
      record: transformMedicalRecord(updatedRecord)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================
   UPDATE PRESCRIPTION
========================= */
exports.updatePrescription = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Only doctors can update prescriptions' });
    }

    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.recordId,
      req.body,
      { new: true }
    ).populate('patientId').populate({
      path: 'doctorId',
      populate: { path: 'userId' }
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({
      success: true,
      record: transformMedicalRecord(record)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
