var Assessment = require('mongoose').model('Assessment');

var strings = require('../../config/strings');

/**
 * Creates a new evaluation for a given year
 */
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

/**
 * Creates a new empty goal with an id for a given evaluation year
 */
exports.createGoal = function(req, res, next) {
	var year = '2016-2017'; //TODO get this as a parameter

	//Go ahead and generate id for the goal
	var id = mongoose.Types.ObjectId();

	//Init goal object with an empty label
	var goalObj = {
		_id: id,
		label: '',
		data: {
			info: ''
		}
	};

	if (req.user) {
		Assessment.findOne({
			department: 'Anthropology/Sociology' //req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				var evaluations = department.evaluations;

				//Find the evaluation for the given year
				var evaluationForYear = evaluations.find(function (elem) {
					return elem.year === year;
				});

				//Make sure the evaluation for given year exists
				if (evaluationForYear) {
					var evaluationObj = evaluationForYear.evaluation;
					var goals = evaluationObj.children;

					var goalsLen = goals.push(goalObj);
					department.save(function (err) {
						if (err) {
							next(err);
						} else {
							res.json(success({goalId: id}));
						}
					});
				} else {
					res.json(error(strings.noEvaluationFound));
				}
			}
		});
	} else {
		res.json(error(strings.notLoggedIn));
	}
};
 * Gets the list of years for the logged in user's department
 */
exports.readAssessments = function (req, res, next) {
	if (req.user) {
		res.json(req.user.evaluations);
	} else {
		res.json(error(strings.notLoggedIn));
	}
};

/**
 * Gets all the information for the evaluation for a specific year
 */
exports.readAssessment = function (req, res, next) {
	var year = '2015-2017'; //TODO Get this as request parameter

	if (req.user) {
		var department = req.user.department;
		Assessment.findOne({
			department: department
		}, 'evaluations', function (err, assessment) {
			if (err) {
				next(err);
			} else {
				var evaluations = assessment.evaluations;
				var eval = evaluations.find(function (elem) {
					return elem.year === year;
				});
				if (eval) {
					res.json(eval);
				} else {
					res.json(error('No evaluation found for the given year'));
				}
			}
		});
	} else {
		res.json(error(strings.notLoggedIn));
	}
};

var error = function (message) {
	return {
		error: true,
		message: message
	}
}