var Assessment = require('mongoose').model('Assessment');

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

exports.logout = function (req, res, next) {
	req.logout();
	res.redirect('/');
};