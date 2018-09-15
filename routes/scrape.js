// Dependencies
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const router = express.Router();
const db = require('../models');

// Scrape frontpage articles
router.get('/new', (req, res) => {
    db.Article
        .find({})
        .then((scrapedArticles) => {

            // Create array of already saved article headlines
            // to be used to check for duplicates
            const articleArr = scrapedArticles.map(article => article.title);

            axios.get('http://houston.eater.com')
                .then((response) => {
                    const $ = cheerio.load(response.data);

                    const newArticleArr = [];
                    $('.c-entry-box--compact__title').each((i, element) => {
                        const newArticle = new db.Article({
                            link: $(element).children('a').attr('href'),
                            title: $(element).children('a').text(),
                            wantToGo: false,
                            hidden: false,
                        });

                        // Verify new article has a link url
                        if (newArticle.link) {

                            // Check for duplicate title
                            if (!articleArr.includes(newArticle.title)) {
                                newArticleArr.push(newArticle);
                            }
                        }
                    });

                    // Add all new articles to collection
                    db.Article
                        .create(newArticleArr)
                        .then(result => res.json({ count: newArticleArr.length })) // returning count of new articles to front end
                        .catch((err) => {});
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});


// Scrape available article archive to preload the site
router.get('/archive', (req, res) => {
    const numArchivePages = 15;

    // Iterate through all 15 archive pages (there are 15 max)
    for (let i = 1; i < numArchivePages + 1; i++) {
        db.Article
            .find({})
            .then((scrapedArticles) => {
                
                // Create array of already saved article headlines
                // to be used to check for duplicates
                const articleArr = scrapedArticles.map(article => article.title);

                const archiveURL = `http://houston.eater.com/archives/${i}`;

                axios.get(archiveURL)
                    .then((response) => {
                        const $ = cheerio.load(response.data);

                        const newArticleArr = [];
                        
                        $('.c-entry-box--compact__title').each((i, element) => {
                            const newArticle = new db.Article({
                                link: $(element).children('a').attr('href'),
                                title: $(element).children('a').text(),
                                wantToGo: false,
                                hidden: false,
                            });
                            
                            // Verify new article has a link url
                            if (newArticle.link) {
                            
                                // Check for duplicate titles
                                if (!articleArr.includes(newArticle.title)) {
                                    newArticleArr.push(newArticle);
                                }
                            }
                        });

                        // Add all new articles to colletion
                        db.Article
                            .create(newArticleArr)
                            .then(result => {
                                res.json({ status: 'archive successfully added database' });
                                if (i === 15){
                                    console.log(totalAdded);
                                }
                            })
                            .catch((err) => {});
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }
});


module.exports = router;
