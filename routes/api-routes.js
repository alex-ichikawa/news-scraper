var axios = require("axios");
var cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {
    app.get('/api', function(req, res) {
        console.log('works');
    });
}