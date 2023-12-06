const Guides = require("../db/guidesModel");

exports.getGuides = async (req, res) => {
  try {
    const guides = await Guides.find({});
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


