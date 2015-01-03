// Require block -- imports all the needed libraries
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var tough = require('tough-cookie');
var app = express();


// Initialization block
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var email = "test@example.com";

var dropboxUrl = "https://www.dropbox.com/forgot";
var dropboxField = "email";
var iftttUrl = "https://ifttt.com/forgot";
var iftttEmailField = "user[email]";
var iftttTokenField = "authenticity_token";

var jar = request.jar();

// Web Server Method Block
app.get('/', function(req, resp) {  
  jar = request.jar();
  makeGetRequest(iftttUrl, resp);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});


// Helper Method Block
function getIFTTTToken(html) {
	$ = cheerio.load(html);
	return $('meta[name=csrf-token]').attr("content");
}

function respond(response, message) {
	response.send("Token: " + message);
}

function makeGetRequest(url, response) {
	
	request({uri: url, jar: jar}, function(err, resp, body) {
		var thisResp = resp;
		var thisBody = body;
		var thisErr = err;

		var iftttToken = getIFTTTToken(body);
		console.log("Made GET request to " + url);
		//console.log(jar);
		makePostRequest(iftttUrl, iftttEmailField, email, iftttTokenField, iftttToken, response);
	});
}

function makePostRequest(url, emailFieldName, emailAddress, tokenFieldName, token, response) {

	var data = {};
	data[emailFieldName] = emailAddress;
	data[tokenFieldName] = token;

	request.post({uri: url, jar: jar, form: data}, function(err, resp, body) {
		//console.log(jar);
		console.log("Made POST request to " + url + " with data: " + JSON.stringify(data, null, 2));
		if (err) {
			respond(response, err);
		} else {
			respond(response, body);
		}
	});	
}