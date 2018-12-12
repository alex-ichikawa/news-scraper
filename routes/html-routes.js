const db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        db.Article.find({})
            .then(function (dbArticle) {
                var hbsObject = {
                    // reverse order so newest articles appear at the top
                    article: dbArticle.reverse()
                };
                res.render("index", hbsObject);
            })
            .catch(function (err) {
                res.json(err);
            });
    })
}
