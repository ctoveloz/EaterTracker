// const bodyParser = require("body-parser"),
//     mongoose = require("mongoose"),
//     axios = require("axios"),
//     cheerio = require("cheerio");
// module.exports = {

//     scrape: function () {
//         axios.get("http://houston.eater.com").then(function (response) {
//             //console.log(response.data);

//             let $ = cheerio.load(response.data);

//             $(".c-entry-box--compact__title").each(function(i, element) {
//                 let result = {};

//                 result.title = $(this)
//                     .children('a')
//                     .text();
//                 result.link = $(this)
//                     .children('a')
//                     .attr('href');

//                 db.Article.create(result)
//                     .then(function(dbArticle){
//                         console.log(dbArticle)
//                     })
//                     .catch(function(err){
//                         return res.json(err)
//                     })

//             });
//         })
//     }
// }