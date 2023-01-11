const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fName: {
    type: String,
    trim:true,
    required: true,
  },
  lName: {
    type: String,
    trim:true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
},{timestamps: true});

module.exports = new mongoose.model("User", userSchema);
