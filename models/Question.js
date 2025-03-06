const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, 
  question: String,
  options: [String],
  correctAnswer: String,
});

module.exports = mongoose.model("Question", questionSchema);
