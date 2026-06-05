const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const adminRoutes = require("./routes/adminRoutes");


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const complaintRoutes = require('./routes/complaintRoutes');
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB Connected');
})
.catch((err) => {
  console.log(err);
});
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
// Test Route
app.get('/', (req, res) => {
  res.send('SIR Backend Running');
});

// Server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});