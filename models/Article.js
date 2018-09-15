const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    link: String,
    hidden: {
        type: Boolean,
        default: false
    },
    wantToGo: {
        type: Boolean,
        default: false
    },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
});

const Article = module.exports = mongoose.model('Article', articleSchema);
