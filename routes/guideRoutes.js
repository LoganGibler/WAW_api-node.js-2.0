// guideRoutes.js
const express = require("express");
const router = express.Router();
const GuideController = require("../controllers/guideControllers");
const authenticate = require("../authMiddleware");

// unprotectedRoutes
router.get("/allGuides", GuideController.getGuides);

// protectedRoutes

// editing guide querys
router.post("/createGuide", authenticate, GuideController.createGuide);
router.post("/deleteGuide", authenticate, GuideController.deleteGuide);
router.post("/approveGuide", authenticate, GuideController.approveGuide);
router.post("/publishGuide", authenticate, GuideController.publishGuide);
router.post("/unpublishGuide", authenticate, GuideController.unpublishGuide);
router.post("/addStep", authenticate, GuideController.addStep);
router.post("/deleteStep", authenticate, GuideController.deleteStep);
router.post("/editStep", authenticate, GuideController.editStep);
router.post("/editDescription", authenticate, GuideController.editDescription);
router.post("/editTitle", authenticate, GuideController.editTitle);
router.post("/editDifficulty", authenticate, GuideController.editDifficulty);

//get*Guides
router.get(
  "/getFeaturedGuides",
  authenticate,
  GuideController.getFeaturedGuides
);

module.exports = router;
