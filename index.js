const https = require('https');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var server = require('http').createServer(app);

/*https.get('https://overpass-api.de/api/interpreter?data=way[highway](50.746,7.154,50.748,7.157);(._;>;);out body;', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(data);
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});*/

app.use(express.static(__dirname));
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});


server.listen(port);
console.log("listening on port " + port);