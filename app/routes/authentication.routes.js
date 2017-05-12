var authentication = require('../controllers/authentication.controller');

var passport = require('passport');

module.exports = function (app) {
	app.route('/signin')
		.get(authentication.renderSignin)
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/signin',
			failureFlash: true
		}));

	app.get('/logout', authentication.logout);
}