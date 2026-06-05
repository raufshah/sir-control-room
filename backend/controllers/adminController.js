const Admin = require("../models/Admin");

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({
      username,
      password,
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    res.json({
      message: "Login Successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  loginAdmin,
};