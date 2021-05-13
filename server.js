//jshint esversion:6
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require("https");
let alert = require('alert');


var listShortenLinks = [];
var listOriginalLinks = [];
errorMessage = "opps, blacklist domain! Try other link";

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.engine('html', require("ejs").renderFile);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
  var listShortenLinks = [];
  var listOriginalLinks = [];
});

app.post('/', function(req, res) {

  const targetLink = req.body.linkObject;
  const url = "https://api.shrtco.de/v2/shorten?url=" + targetLink;
  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data, error) {
      const linkData = JSON.parse(data);
      try {
        const completeTargetLink = "http://" + targetLink;
        listOriginalLinks.push(completeTargetLink);
        const shortenLink = linkData.result.short_link;
        const completeShortenLink = "http://" + shortenLink;
        listShortenLinks.push(completeShortenLink);
        res.render("index1", {
          shortlink: listShortenLinks,
          originallink: listOriginalLinks
        });
      } catch (e) {
        listShortenLinks.push(errorMessage);
        res.render("index1", {
          shortlink: listShortenLinks,
          originallink: listOriginalLinks
        });
      }

    });

  });


});

app.listen(process.env.PORT || 3000, function() {
  console.log("the server is up and running at 3000");
});
