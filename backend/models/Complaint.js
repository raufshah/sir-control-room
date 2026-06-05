const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    epicNumber: {
      type: String,
    },

    district: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    document: {
  type: String,
},

    status: {
      type: String,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);