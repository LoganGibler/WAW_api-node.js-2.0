const mongoose = require("mongoose");

const guidesSchema = mongoose.Schema({
  vmtitle: {
    type: String,
    required: [true, "Please enter the title of this vm."],
  },
  hostedby: {
    type: String,
    required: [true, "Please enter where you found this vm."],
  },
  description: {
    type: String,
    required: [true, "Please provide a description of this vm."],
  },
  difficulty: {
    type: String,
  },
  steps: [],
  published: {
    type: Boolean,
  },
  author: {
    type: String,
  },
  date: {
    type: String,
  },
  approved: {
    type: Boolean,
  },
  featured: {
    type: Boolean,
  },
});

const Guides = mongoose.model("Guides", guidesSchema);

module.exports = Guides;
