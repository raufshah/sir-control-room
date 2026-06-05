const express = require('express');

const router = express.Router();
const upload = require('../middleware/upload');

const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
  getComplaintById,
} = require('../controllers/complaintController');

// Create Complaint API
router.post(
  '/',
  upload.single('document'),
  createComplaint
);
router.get('/', getComplaints);
router.put('/:id', updateComplaintStatus);
router.get('/track/:complaintId', getComplaintById);

module.exports = router;