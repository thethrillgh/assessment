var Assessment = require('mongoose').model('Assessment');

exports.create = function(req, res, next) {
	//var years = req.params.year; TODO Get this working
	var years = '2016-2017';
	var evaluationObj = {year: years};

	if (req.user) {
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, assessment) {
			if (err) {
				next(err);
			} else {
				assessment.evaluations.push(evaluationObj);
				assessment.save(function (err) {
					if (err) {
						next(err);
					} else {
						res.json({success: true});
					}
				});
			}
		});
	} else {
		res.json(error(strings.notLoggedIn))
	}
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