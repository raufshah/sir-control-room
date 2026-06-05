const Complaint = require('../models/Complaint');

// Generate Complaint ID
const generateComplaintId = () => {
  return 'CMP' + Math.floor(Math.random() * 1000000);
};

// Create Complaint
const createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      complaintId: generateComplaintId(),

      name: req.body.name,
      mobile: req.body.mobile,
      epicNumber: req.body.epicNumber,
      district: req.body.district,
      category: req.body.category,
      description: req.body.description,
      document: req.file
  ? req.file.filename
  : "",
    });

    res.status(201).json({
      message: 'Complaint Submitted Successfully',
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({
      createdAt: -1,
    });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    complaint.status = req.body.status;

    await complaint.save();

    res.json({
      message: "Status Updated",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.complaintId,
    });

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  getComplaintById,
};