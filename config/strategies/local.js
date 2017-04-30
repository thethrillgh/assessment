var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Assessment = require('mongoose').model('Assessment');

module.exports = function() {
	passport.use(new LocalStrategy(function(username, password, done) {
		Assessment.findOne({
			username: username
		}, function (err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, {
					message: 'Unknown user'
				});
			}

			if (!user.authenticate(password)) {
				return done(null, false, {
					message: 'Invalid password'
				});
			}

			return done(null, user);
		});
	}));
};