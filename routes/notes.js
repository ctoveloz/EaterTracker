// Dependencies
const express = require('express'),
    router = express.Router(),
    db = require('../models');

// Get all notes
router.get('/getNotes/:id', function (req, res) {
    db.Article
        .findOne({
            _id: req.params.id
        })
        .populate('notes')
        .then(results => res.json(results))
        .catch(err => res.json(err));
});

// Get single note
router.get('/getSingleNote/:id', function (req, res) {
    db.Note
        .findOne({
            _id: req.params.id
        })
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

// Create note
router.post('/createNote', function (req, res) {
    let {
        body,
        articleId
    } = req.body;
    let note = {
        body
    };
    db.Note
        .create(note)
        .then(result => {
            db.Article
                .findOneAndUpdate({
                    _id: articleId
                }, {
                    $push: {
                        notes: result._id
                    }
                }, {
                    new: true
                })
                .then(data => res.json(result))
                .catch(err => res.json(err));
        })
        .catch(err => res.json(err));
});

// Delete note
router.post('/deleteNote', (req, res) => {
    let {
        articleId,
        noteId
    } = req.body;
    db.Note
        .remove({
            _id: noteId
        })
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

// Delete ALL notes
router.delete('/destroyAll', (req,res) => {
    db.Note
        .deleteMany({})
        .then(result => res.json(result))
        .catch(err => res.json(err));
});


module.exports = router;