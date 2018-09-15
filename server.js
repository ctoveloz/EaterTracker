// DEPENDANCIES
const express = require('express'),
    exphbs = require('express-handlebars'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    axios = require('axios'),
    cheerio = require('cheerio'),
    CronJob = require('cron').CronJob,
    cronScrape = require('./server/scrape');



// INITIALIZE EXPRESS
const app = express();



// DATABASE SETUP
const config = require('./config/database')
mongoose.Promise = Promise;
mongoose
    .connect(config.database, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(status => {
        console.log(`Connected to database '${status.connections[0].name}' on ${status.connections[0].host}:${status.connections[0].port}`)
    })
    .catch(err => {
        console.log('There was a error connecting to the database:', err)
    });

// MIDDLEWARE SETUP
// -- Logging
app.use(logger('dev'));

// -- Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// -- Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// -- Static directories
app.use(express.static('public'));
app.use('/articles', express.static('public'))
app.use('/notes', express.static('public'))



// ROUTE SETUP
const index = require('./routes/index'),
    scrape = require('./routes/scrape'),
    articles = require('./routes/articles'),
    notes = require('./routes/notes');

app.use('/', index);
app.use('/scrape', scrape);
app.use('/articles', articles);
app.use('/notes', notes);

// CRON JOB SETUP
const job = new CronJob('0 */30 * * * *', function () {
    const d = new Date();
    cronScrape();
    console.log('Cron interval scrape complete:', d);
});

job.start();
console.log('Cron Job Initalized: Server will automatically scrape target every 30 minutes.');

// SERVER SETUP
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Listening on http://localhost:' + PORT)
});
