// guideRoutes.js
const express = require("express");
const router = express.Router();
const GuideController = require("../controllers/guideControllers");
const authenticate = require("../authMiddleware");

router.get("/allGuides", GuideController.getGuides);

// Add more guide-related routes as needed

module.exports = router;
