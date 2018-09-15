// Dependencies
const cheerio = require('cheerio');
const axios = require('axios');

const db = require('../models');

// Scrape frontpage articles
function cronScrape(){
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
}


module.exports = cronScrape;
