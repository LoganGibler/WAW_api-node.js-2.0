// userRoutes.js
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userControllers")
const authenticate = require("../authMiddleware");

router.get("/users", UserController.getUsers);

// Add more user-related routes as needed

module.exports = router;