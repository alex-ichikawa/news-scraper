var axios = require("axios");
var cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {
    app.get("/api/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.autoblog.com/news/").then(function (response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every h2 within an article tag, and do the following:
            $(".list_record").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .find($('.record-heading'))
                    .children()
                    .text();
                result.body = $(this)
                    .find($('.description'))
                    .children()
                    .text();
                result.link = 'https://www.autoblog.com' + $(this)
                    .find($('.record-heading'))
                    .children("a")
                    .attr("href");

                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            });
            res.send("Scrape Complete");
        });
    });

    // Get article by id
    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("note")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
    // Post note to article
    app.post("/articles/:id", function (req, res) {
        db.Note.create(req.body)
            .then(function (dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
}