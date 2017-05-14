var authentication = require('../controllers/authentication.controller');

var passport = require('passport');

module.exports = function (app) {
	app.route('/signin')
		.get(authentication.renderSignin)
		.post(authentication.signin);

	app.get('/departments', authentication.getDepartments);

	/* app.post('/signin', passport.authenticate('local', function (err, user, info) {
		if (err) {
			return next(err);
		}
		if (user) {
			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}
				res.json(utilities.success());
			});
		} else {
			res.json(utilities.error(info.message));
		}
	})); */

	app.get('/logout', authentication.logout);
}