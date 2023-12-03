const Users = require("../db/usersModel");

exports.getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add more user-related controller functions as needed
