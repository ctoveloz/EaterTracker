const express = require("express"),
    bodyParser = require("body-parser"),
    logger = require("morgan"),
    mongoose = require("mongoose"),
    axios = require("axios"),
    cheerio = require("cheerio");

let CronJob = require("cron").CronJob;

const db = require("./models");

//const Scrape = require("./server/scrape.js")

const PORT = 3000;

const app = express();

// Middleware

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/EaterTrackerDB", { useNewUrlParser: true });

// Routes

// Scrape the front page of houston.eater.com
app.get("/scrape", function (req, res) {
    scrape()
    // .then(function(){
    //     res.send('Scrape complete')
    // })
    // .catch(function(err){
    //     return res.json(err);
    // })
})

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });



// Scrape the archive of houston.eater.com
// this is used to initially populate the database
app.get("/scrape-archive", function (req, res) {

})


// Helper functions
function scrape() {
    axios.get("http://houston.eater.com").then(function (response) {
        //console.log(response.data);

        const $ = cheerio.load(response.data);

        $(".c-entry-box--compact__title").each(function (i, element) {
            let result = {};

            result.title = $(this)
                .children('a')
                .text();
            result.link = $(this)
                .children('a')
                .attr('href');

            db.Article.create(result)
                .then(function (dbArticle) {
                    //console.log(dbArticle)
                })
                .catch(function (err) {
                    return res.json(err)
                });
        });
    })
    .catch(function(err){
        console.log(err)
    })
};

// CronJob to scrape site and add new entries to database every 30 minutes
const job = new CronJob('0 */30 * * * *', function () {
    const d = new Date();
    scrape();
    console.log('cron interval scrape complete:', d);
});
console.log('Cron Scrape Initalized: node server will scrape site automatically every 30 minutes.');
job.start();

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});