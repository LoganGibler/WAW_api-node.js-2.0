// guideRoutes.js
const express = require("express");
const router = express.Router();
const GuideController = require("../controllers/guideControllers");
const authenticate = require("../authMiddleware");

// unprotectedRoutes
// router.get("/allGuides", authenticate, GuideController.allGuides);

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

router.get(
  "/getPublishedUnapprovedGuides",
  authenticate,
  GuideController.getPublishedUnapprovedGuides
);

router.post(
  "/getUsersPublishedUnreviewedGuides",
  authenticate,
  GuideController.getUsersPublishedUnreviewedGuides
);

router.get(
  "/getPublishedApprovedGuides",
  authenticate,
  GuideController.getPublishedApprovedGuides
);

router.post(
  "/getPublishedApprovedGuidesByUser",
  authenticate,
  GuideController.getPublishedApprovedGuidesByUser
);

router.post(
  "/getPublicGuideById",
  authenticate,
  GuideController.getPublicGuideById
);

router.post(
  "/getPrivateGuideById",
  authenticate,
  GuideController.getPrivateGuideById
);

router.post(
  "/getPrivateGuidesByUserId",
  authenticate,
  GuideController.getPrivateGuidesByUserId
);

module.exports = router;
