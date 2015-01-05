// Require block -- imports all the needed libraries
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var tough = require('tough-cookie');
var app = express();

var websites = {
	dropbox: {
		data: { confirm:'go', is_reset:'False' },
		tokenTag: 'input[name=t]',
		tokenAttr: 'value',
		emailField: 'email',
		tokenField: 't',
		getUrl: 'https://www.dropbox.com/forgot',
		postUrl: 'https://www.dropbox.com/forgot' 
	}, ifttt: {
		data: {},
		tokenTag: 'meta[name=csrf-token]',
		tokenAttr: 'content',
		emailField: 'user[email]',
		tokenField: 'authenticity_token',
		getUrl: 'https://ifttt.com/forgot',
		postUrl: 'https://ifttt.com/forgot'
	}
};

// Initialization block
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));


// Web Server Method Block
app.get('/', function(req, resp) {  
  //resetIFTTT(email);
  resetWebsite(iftttEmail, websites['dropbox']);
  resetWebsite(iftttEmail, websites['ifttt']);
  respond(resp, "OK");
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});

// Generic Website Method Block
function resetWebsite(email, website) {
	var cookieJar = request.jar();
	console.log(JSON.stringify(website));
	makeGetRequest(email, website, cookieJar);
}

function makeGetRequest(email, website, jar) {
	request({uri: website.getUrl, jar: jar}, function(err, resp, body) {
		if (err) {
			console.log(err);
		}
		var token = getToken(website, body);
		console.log(token);
		makePostRequest(email, website, jar, token);
	});
}

function makePostRequest(email, website, jar, token) {
	var data = website.data;
	data[website.emailField] = email;
	data[website.tokenField] = token;

	request.post({uri: website.postUrl, jar: jar, form: data}, function(err, resp, body) {
		if(err) {
			console.log(err);
		}
	});
}

function getToken(website, html) {
	$ = cheerio.load(html);
	console.log(website.tokenTag + " -- " + website.tokenAttr);
	return $(website.tokenTag).attr(website.tokenAttr);
}

// Generic Helper Method Block
function  respond(response, message) {
	response.send("Token: " + message);
}