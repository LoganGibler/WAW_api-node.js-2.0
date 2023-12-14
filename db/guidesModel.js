const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
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
    default: false,
  },
  author: {
    type: String,
  },
  author_id: {
    type: String,
  },
  date: {
    type: String,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  system: {
    type: String,
    default: "hidden",
  },
});

const Guides = mongoose.model("Post", postSchema);

module.exports = Guides;
