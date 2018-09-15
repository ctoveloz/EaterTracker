// Dependencies
const express = require('express');
const router = express.Router();
const db = require('../models');

// Save
router.get('/save/:id', (req, res) => {
    db.Article
        .update({ _id: req.params.id }, { wantToGo: true })
        .then(result => res.redirect('/'))
        .catch(err => res.json(err));
});

// Hide
router.get('/hide/:id', (req, res) => {
    db.Article
        .update({ _id: req.params.id }, { hidden: true })
        .then(result => res.redirect('/'))
        .catch(err => res.json(err));
});

// View saved articles
router.get('/viewSaved', (req, res) => {
    db.Article
        .find({})
        .then(result => res.render('savedArticles', { articles: result }))
        .catch(err => res.json(err));
});

// Delete article
router.delete('/deleteArticle/:id', (req,res) => {
    db.Article
        .remove({_id: req.params.id})
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

// Delete ALL articles
router.delete('/destroyAll', (req,res) => {
    db.Article
        .deleteMany({})
        .then(result => res.json(result))
        .catch(err => res.json(err));
});


module.exports = router;
