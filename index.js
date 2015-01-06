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
	}, tumblr: {
		data: {},
		tokenTag: 'meta[name=tumblr-form-key]',
		tokenAttr: 'content',
		emailField: 'email',
		tokenField: 'form_key',
		getUrl: 'https://www.tumblr.com/forgot_password',
		postUrl: 'https://www.tumblr.com/forgot_password'
	}, myspace: {
		data: { remindOption: 'em' },
		emailField: 'email',
		getUrl: 'https://myspace.com/account/forgotpassword',
		postUrl: 'https://myspace.com/ajax/account/forgotpassword'
	}, github: {
		data: { commit: 'submit' },
		tokenTag: 'meta[name=csrf-token]',
		tokenAttr: 'content',
		emailField: 'email',
		getUrl: 'https://github.com/password_reset',
		postUrl: 'https://github.com/password_reset'
	}
};

// Initialization block
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Pass to next layer of middleware
    next();
});


// Web Server TEST Method Block
app.get('/resetpassword/test/', function(req, resp) {  
	resetEmail = req.param('email');
	testSite = req.param('site');
	resetWebsite(resetEmail, testSite);
	respond(resp, "Test: ressting password for " testSite + " at the site " + testSite);
});

// Web Server Method Block
app.get('/resetpassword/:email', function(req, resp) {  
	resetEmail = req.param('email');
	resetAllWebsites(resetEmail);
	respond(resp, "All passwords reset for: " + resetEmail);
});

app.listen(app.get('port'), function() {
	console.log("Node app is running at localhost:" + app.get('port'));
});

function resetAllWebsites(email) {
	var keys = Object.keys(websites);
	for (var i=keys.length; i--;) {
    	resetWebsite(email, websites[keys[i]]);
	}
}

// Generic Website Method Block
function resetWebsite(email, website) {
	var cookieJar = request.jar();
	makeGetRequest(email, website, cookieJar);
}

function makeGetRequest(email, website, jar) {
	request({uri: website.getUrl, jar: jar}, function(err, resp, body) {
		if (err) {
			console.log(err);
		}
		var token = getToken(website, body);
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
	return $(website.tokenTag).attr(website.tokenAttr);
}

// Generic Helper Method Block
function  respond(response, message) {
	response.send(message);
}