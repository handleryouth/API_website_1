//jshint esversion:6
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require("https");
let alert = require('alert');


var listShortenLinks = [];
var listOriginalLinks = [];
var listTargetLinks = [];
errorMessage = "opps, blacklist domain! Try other link";

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.engine('html', require("ejs").renderFile);

app.get("/", function(req, res) {
  listShortenLinks.splice(0, listShortenLinks.length);
  listOriginalLinks.splice(0, listOriginalLinks.length);
  listTargetLinks.splice(0, listTargetLinks.length);
  res.sendFile(__dirname + "/index.html");
});

app.post('/', function(req, res) {
  var targetLink = req.body.linkObject.replace("https://", "").replace("http://", "");
  if (targetLink.includes("https://") === false || targetLink.includes("http://") === false) {
    targetLink = "http://" + targetLink;
  }
  if (targetLink === listTargetLinks[listTargetLinks.length - 1]) {
    res.render("index1", {
      shortlink: listShortenLinks,
      originallink: listTargetLinks,
      conciselink: listOriginalLinks
    });
  } else {
    listTargetLinks.push(targetLink);
    const url = "https://api.shrtco.de/v2/shorten?url=" + targetLink;
    https.get(url, function(response) {
      response.on("data", function(data, error) {
        try {
          const linkData = JSON.parse(data);
          linkData.toString().replace('/', '');
          try {
            var completeTargetLink = targetLink;
            if (completeTargetLink !== listOriginalLinks[(listOriginalLinks.length - 1)]) {
              if (completeTargetLink.length > 25) {
                completeTargetLink = completeTargetLink.substring(0, 50) + "...";
              }
              listOriginalLinks.push(completeTargetLink);
              const shortenLink = linkData.result.short_link;
              var completeShortenLink = shortenLink;

              listShortenLinks.push(completeShortenLink);
              res.render("index1", {
                shortlink: listShortenLinks,
                originallink: listTargetLinks,
                conciselink: listOriginalLinks
              });
            } else {
              res.render("index1", {
                shortlink: listShortenLinks,
                originallink: listTargetLinks,
                conciselink: listOriginalLinks
              });
            }
          } catch (e) {
            listShortenLinks.push(errorMessage);

          }
        } catch (e) {
          if (targetLink.length > 25) {
            targetLink = targetLink.substring(0, 50) + "...";
          }
          listOriginalLinks.push(targetLink);
          listShortenLinks.push("the link cannot be shorten");
          res.render("index1", {
            shortlink: listShortenLinks,
            originallink: listTargetLinks,
            conciselink: listOriginalLinks
          });
        }
      });

    });
  }

});

app.listen(process.env.PORT || 3000, function() {
  console.log("the server is up and running at 3000");
});
