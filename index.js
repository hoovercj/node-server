// Require block -- imports all the needed libraries
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var tough = require('tough-cookie');
var app = express();


// Initialization block
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

var email = "login@codyhoover.com";

var dropboxUrl = "https://www.dropbox.com/forgot";
var dropboxField = "email";

var jar = request.jar();

// Web Server Method Block
app.get('/', function(req, resp) {  
  resetIFTTT(email);
  respond(resp, "Done");
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});


// IFTTT Helper Method Block
var iftttUrl = "https://ifttt.com/forgot";
var iftttEmailField = "user[email]";
var iftttTokenField = "authenticity_token";

function resetIFTTT(email) {
	jar = request.jar();
	makeIFTTTGetRequest(email);
}

function makeIFTTTGetRequest() {	
	request({uri: iftttUrl, jar: jar}, function(err, resp, body) {
		if (err) {
			console.log(err);
		}
		var iftttToken = getIFTTTToken(body);
		makeIFTTTPostRequest(email, iftttToken);
	});
}

function getIFTTTToken(html) {
	$ = cheerio.load(html);
	return $('meta[name=csrf-token]').attr("content");
}

function makeIFTTTPostRequest(emailAddress, token) {

	var data = {};
	data[iftttEmailField] = emailAddress;
	data[iftttTokenField] = token;

	request.post({uri: iftttUrl, jar: jar, form: data}, function(err, resp, body) {
		if (err) {
			console.log(err);
		}
	});	
}


// Generic Helper Method Block
function  respond(response, message) {
	response.send("Token: " + message);
}