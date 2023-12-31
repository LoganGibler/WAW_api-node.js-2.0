const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  username: {
    type: String,
    minlength: 5,
    unique: true,
    required: [true, "Please enter username"],
  },
  password: {
    type: String,
    minlength: 7,
    required: [true, "Please enter password"],
  },
  admin: {
    type: Boolean,
    default: false,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: {
    type: Number,
  },
  bookmarkedGuides: [],
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
