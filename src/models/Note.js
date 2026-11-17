const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 10000 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);