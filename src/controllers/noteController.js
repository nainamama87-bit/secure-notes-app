const Note = require("../models/Note");

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ owner: req.userId }).sort({ updatedAt: -1 });
    res.json({ notes });
  } catch (error) { next(error); }
};

exports.createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    const note = await Note.create({ title, content, owner: req.userId });
    res.status(201).json({ note });
  } catch (error) { next(error); }
};

exports.updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      { title: title.trim(), content: content.trim() },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ note });
  } catch (error) { next(error); }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (error) { next(error); }
};