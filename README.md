# Password Resetter

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application was built on top of the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed as well as Foreman. 

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
~~$ npm start~~
$ foreman start web
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```

## Using the Service

The server responds to GET requests made to the url: https://peaceful-refuge-8041.herokuapp.com/resetpassword/

For example, an email to https://peaceful-refuge-8041.herokuapp.com/resetpassword/test@example.com will attempt to reset the password for all sites for the email test@example.com

## Contributing

Passwords are currently being reset by submitting a GET request to fetch the site with a password reset form. From there, a csrf-token is extracted using cheerio if necessary before a POST request sends the token and email address to the appropriate POST url. To add a new site simply add a new object to the 'websites' list at the top of the index.js file.

Be sure to include the GET url and the POST url, even if they are the same, the names of the token and email parameters for the POST request, as well as the necessary information to extract the csrf token if it is needed. Additionally, some sites submit extra information with the post request. This can be hardcoded into a data object.

### Testing
!! A work in progress !!
After adding a site it is important to test it. Currently the main endpoint calls the reset for all sites. To test a particular site in development, hit the endpoint /resetpassword/test/?site=name&email=address

This must work before any additions will be merged.

## Currently Supported Sites

This is the list of currently supported sites as they are encoded in index.js. Note: myspace and github may not be working at the moment

```
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
```

## Unsupported Sites

Multiple Steps:
Google, Yahoo, Facebook, Twitter

Captcha:
AWS

Username:
Reddit, Neopets

## Alternative Implementations

A WebDriver like [PhantomJS](http://phantomjs.org/related-projects.html) might work to fully simulate filling out the form, especially for more complicated web flows or sites that intentionally obfuscate csrf tokens

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
