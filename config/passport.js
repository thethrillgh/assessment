var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');

var strings = require('./strings');

module.exports = function() {
	var Assessment = mongoose.model('Assessment');

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		Assessment.findOne({
			_id: id
		}, '-password -salt', function (err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({
		usernameField: 'department',
		passwordField: 'password'
	}, function (department, password, done) {
		Assessment.findOne({
			department: department
		}, function (err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, {message: strings.noUserFound});
			}

			if (!user.authenticate(password)) {
				return done(null, false, {message: strings.incorrectPassword});
			}

			return done(null, user);
		});
	}));
}