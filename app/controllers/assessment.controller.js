var Assessment = require('mongoose').model('Assessment');

exports.create = function(req, res, next) {
	var department = req.params.department;
	Assessment.count({department: department}, function (err, count) {
		if (err) {
			next(err);
		} else {
			res.send(count);
		}
	});
};

exports.readAssessments = function (req, res, next) {
	var department = req.params.department;
	Assessment.findOne({department: department}, function(err, assessments) {
		if (err) {
			next(err);
		} else {
			res.json(assessments);
		}
	});
};

exports.read = function (req, res, next) {
	var department = req.params.department;
	var year = req.params.year;
	Assessment.find({department: department}, function(err, assessments) {
		if (err) {
			next(err);
		} else {

		}
	});
};