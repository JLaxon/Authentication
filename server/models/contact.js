let mongoose = require("mongoose");

// create a model class
let contacts = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    number: String,
  },
  {
    collection: "contacts",
  }
);

module.exports = mongoose.model("contacts", contacts);