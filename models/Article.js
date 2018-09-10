const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: 'Note'
    },
    hidden: {
        type: Boolean,
        default: false,
        required: true
    }
});

let Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;