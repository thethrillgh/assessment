var Assessment = require('mongoose').model('Assessment');

var passport = require('passport');

var utilities = require('../utilities');

exports.renderSignin = function (req, res, next) {
	Assessment.find({}, 'department', {sort: {department: 1}}, function (err, departments) {
		if (!req.user) { //Not signed in
			res.render('signin.ejs', {
				messages: req.flash('error'),
				title: 'Signin',
				departments: departments
			});
		} else {
			res.redirect('/');
		}
	});
};

exports.signin = function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
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
	})(req, res, next);
};

exports.getDepartments = function (req, res, next) {
	Assessment.find({}, '-evaluations -password -salt', function (err, departments) {
		res.json(utilities.success({departments: departments}));
	});
};

exports.logout = function (req, res, next) {
	req.logout();
	res.json(utilities.success());
};