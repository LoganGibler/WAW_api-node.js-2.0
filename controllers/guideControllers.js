const { default: mongoose } = require("mongoose");
const Guides = require("../db/guidesModel");
const Users = require("../db/usersModel");
const { ObjectID } = require("mongodb");

exports.allGuides = async (req, res) => {
  try {
    const guides = await Guides.find({});
    res.status(200).json({ guides });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createGuide = async (req, res) => {
  try {
    const guide = await Guides.create(req.body);
    guide && res.status(200).json({ message: "Guide has been created." });
    !guide && res.status(500).json({ message: "Guide creation failed." });
  } catch (error) {
    res.status(500).json({ message: "Guide creation failed." });
  }
};

exports.deleteGuide = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const deletedGuide = await Guides.deleteOne(filter);
    deletedGuide &&
      res.status(200).json({ message: "guide successfully deleted." });
    !deletedGuide && res.status(500).json({ message: "/deleteGuide failed." });
  } catch (error) {
    res.status(500).json({ message: "deleted guide failed!" });
  }
};

exports.approveGuide = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const update = { approved: true };
    const updatedGuide = await Guides.updateOne(filter, update);
    updatedGuide
      ? res.status(200).json({ message: "Guide Successfully approved" })
      : res.status(500).json({ message: "/approveGuide has failed." });
  } catch (error) {
    res.status(500).json({ message: "/approveGuide has failed." });
  }
};

exports.publishGuide = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const update = { published: true };
    const updatedGuide = await Guides.updateOne(filter, update);
    updatedGuide
      ? res.status(200).json({ message: "/publishGuide successful." })
      : res.status(500).json({ message: "/publishGuide has failed." });
  } catch (error) {
    res.status(500).json({ message: "/publishGuide has failed." });
  }
};

exports.unpublishGuide = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const update = { published: false, approved: false };
    const updatedGuide = await Guides.updateOne(filter, update);
    updatedGuide
      ? res.status(200).json({ message: "/unpublishGuide Successful" })
      : res.status(500).json({ message: "/unpublishGuide has failed." });
  } catch (error) {
    res.status(500).json({ message: "/unpublishGuide has failed." });
  }
};

exports.addStep = async (req, res) => {
  try {
    let newStep = { step: req.body.step };

    const step = await Alerts.updateOne(
      { _id: req.body._id },
      { $push: { steps: newStep } }
    );

    step
      ? res.status(200).json({ message: "/addstep successful." })
      : res.status(500).json({ message: "/addstep failed." });
  } catch (error) {
    res.status(500).json({ message: "/addStep failed." });
  }
};

exports.deleteStep = async (req, res) => {
  try {
    const { _id, index } = req.body;
    let filter = { _id: _id };
    let update = {};
    let editedStep = "steps." + index + ".step";
    update[editedStep] = null;
    const deletedStep = await Guides.findOneAndUpdate(filter, update);
    deletedStep
      ? res.status(200).json({ message: "/deleteStep successful" })
      : res.status(500).json({ message: "/deleteStep failed." });
  } catch (error) {
    res.status(500).json({ message: "/deleteStep failed." });
  }
};

exports.editStep = async (req, res) => {
  try {
    const { _id, index, newStepData } = req.body;
    let filter = { _id: _id };
    let update = {};
    let editedStep = "steps." + index + ".step";
    update[editedStep] = newStepData;
    const updatedStep = await Alerts.findOneAndUpdate(filter, update, {
      new: true,
    });
    updatedStep
      ? res.status(200).json({ message: "/editStep successful." })
      : res.status(500).json({ message: "/editStep failed." });
  } catch (error) {
    res.status(500).json({ message: "/editStep failed." });
  }
};

exports.editDescription = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const update = { description: req.body.newData };
    const editedGuide = await Guides.findOneAndUpdate(filter, update);
    editedGuide
      ? res.status(200).json({ message: "/editDescription successful" })
      : res.status(500).json({ message: "/editDescription failed." });
  } catch (error) {
    res.status(500).json({ message: "/editDescription failed." });
  }
};

exports.editTitle = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const update = { vmtitle: req.body.newData };
    const updatedGuide = await Guides.findOneAndUpdate(filter, update);
    updatedGuide
      ? res.status(200).json({ message: "/editTitle successful." })
      : res.status(500).json({ message: "/editTitle failed." });
  } catch (error) {
    res.status(500).json({ message: "/editTitle failed." });
  }
};

exports.editDifficulty = async (req, res) => {
  try {
    const filter = { _id: req.body._id };
    const update = { difficulty: req.body.newData };
    const updatedGuide = await Guides.findOneAndUpdate(filter, update);
    updatedGuide
      ? res.status(200).json({ message: "/editTitle successful." })
      : res.status(500).json({ message: "/editTitle failed." });
  } catch (error) {
    res.status(500).json({ message: "/editDifficulty failed." });
  }
};

exports.getFeaturedGuides = async (req, res) => {
  try {
    const filter = { featured: true };
    const featuredGuides = await Guides.find(filter);
    res.status(200).json({ featuredGuides });
  } catch (error) {
    res.status(500).json({ message: "could not find featured guides." });
  }
};

exports.getPublishedUnapprovedGuides = async (req, res) => {
  try {
    // const userID = req.body._id;
    // const userFilter = { _id: new mongoose.Types.ObjectId(userID) };
    // const user = await Users.findOne(userFilter);

    // RESUME WORK HERE

    const filter = { approved: false, published: true };
    const publishedUnapprovedGuides = await Guides.find(filter);
    console.log(publishedUnapprovedGuides);
    res.status(200).json({ publishedUnapprovedGuides });
  } catch (error) {
    res.status(500).json({ message: "could not find featured guides." });
  }
};

exports.getUsersPublishedUnreviewedGuides = async (req, res) => {
  try {
    const filter = {
      author_id: req.body._id,
      published: true,
      approved: false,
    };
    const usersPublishedUnreviewedGuides = await Guides.find(filter);
    res.status(200).json({ usersPublishedUnreviewedGuides });
  } catch (error) {
    res.status(500).json({ message: "could not find guides." });
  }
};

exports.getUsersGuides = async (req, res) => {
  try {
    const filter = { author_id: req.body._id };
    const foundGuides = await Guides.find(filter);
    foundGuides
      ? res.status(200).json({ foundGuides })
      : res.status(500).json({ message: "no guides found." });
  } catch (error) {
    res.status(500).json({ message: "couldnt find any users guides" });
  }
};

// store user ID in cookie upon login. then grab cookie out of request, doesnt have to be http only, but prefered.
exports.getPublishedApprovedGuides = async (req, res) => {
  try {
    const filter = { approved: true, published: true };
    const publicGuides = await Guides.find(filter);
    res.status(200).json({ publicGuides });
  } catch (error) {
    res.status(500).json({ message: "could not find guides." });
  }
};

exports.getPublishedApprovedGuidesByUser = async (req, res) => {
  try {
    const filter = { author_id: req.body._id, published: true, approved: true };
    const approvedGuides = await Guides.find(filter);
    res.status(200).json({ approvedGuides });
  } catch (error) {
    res.status(500).json({ message: "could not find guides." });
  }
};

exports.getPublicGuideById = async (req, res) => {
  // this should run specifically when a user clicks on a guide on the front end.
  // on frontend, if guide is not published or approved,
  //  alert("This guide is not published.")
  // then route back to homepage.
  // nvm ima just tighten the query params.
  try {
    const filter = { _id: req.body._id, published: true, approved: true };
    const guide = await Guides.find(filter);
    res.status(200).json({ guide });
  } catch (error) {
    res.status(500).json({ message: "could not find guides." });
  }
};

exports.getPrivateGuideById = async (req, res) => {
  try {
    const filter = { _id: req.body._id, published: false, approved: false };
    const guide = await Guides.find(filter);
    res.status(200).json({ guide });
  } catch (error) {
    res.status(500).json({ message: "could not find guides." });
  }
};

exports.getPrivateGuidesByUserId = async (req, res) => {
  // pass in USER _id here, NOT guide _id
  try {
    const filter = {
      author_id: req.body._id,
      published: false,
      approved: false,
    };
    const allUserGuides = await Guides.find(filter);
    res.status(200).json({ allUserGuides });
  } catch (error) {
    res.status(500).json({ message: "could not find guides." });
  }
};

exports.getSearchResult = async (req, res) => {
  try {
    const searchResult = await Guides.find(
      { $text: { $search: req.body.searchData } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    res.status(200).json({ searchResult });
  } catch (error) {
    res.status(500).json({ message: "Search failed." });
  }
};

exports.getUsersGuideByID = async (req, res) => {
  const userID = req.body._id;
  const guideID = req.body.guide_id;

  try {
    const filter = { _id: new mongoose.Types.ObjectId(guideID) };
    const guide = await Guides.findOne(filter);
    // console.log(guide.author_id);

    guide.author_id === userID
      ? res.status(200).json({ guide })
      : res.status(500).json({ message: "guide not available for viewing." });
  } catch (error) {
    res.status(500).json();
  }
};
