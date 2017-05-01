var Assessment = require('mongoose').model('Assessment');

exports.render = function (req, res, next) {
	var pageData = {title: 'Home'};
	if (req.user) {
		pageData.loggedIn = true;
		pageData.department = req.user.department;
	} else {
		pageData.loggedIn = false;
	}

	res.render('index.ejs', pageData);
};