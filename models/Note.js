const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const noteSchema = new Schema({
    body: String,
});

const Note = module.exports = mongoose.model('Note', noteSchema);