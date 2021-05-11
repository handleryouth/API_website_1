//jshint esversion:6
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require("https");


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.engine('html', require("ejs").renderFile);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post('/', function(req, res) {

      const targetLink = req.body.linkObject;
      const url = "https://api.shrtco.de/v2/shorten?url=" + targetLink;
      https.get(url, function(response) {
        console.log(response.statusCode);

          response.on("data", function(data) {
            const linkData = JSON.parse(data);
            const shortenLink = linkData.result.short_link;
            res.render("index1", {short1: shortenLink, original1: targetLink});
          });

  });


});

app.listen(process.env.PORT || 3000, function() {
  console.log("the server is up and running at 3000");
});
