var mongoose = require('mongoose');
var Assessment = mongoose.model('Assessment');

var strings = require('../../config/strings');

/**
 * Creates a new evaluation for a given year
 */
exports.create = function(req, res, next) {
	//Init object for the evaluation with the given year
	var evaluationObj = {year: req.body.year};

	if (req.user) {
		var evaluationObj = req.body;
		if (evaluationObj.year) {
			var id = mongoose.Types.ObjectId();
			evaluationObj._id = id;

			//Init the empty evaluation object that will be passed to Angular
			evaluationObj.evaluation = {
				label: 'Mission Statement',
				data: {
					info: ''
				}
			};

			//Get the department from the database, add the new evaluation to the evaluations arr, and save
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
							res.json(success({assessmentId: id}));
						}
					});
				}
			});
		} else {
			res.json(error(strings.noEvaluationYearGiven));
		}
	} else {
		res.json(error(strings.notLoggedIn))
	}
};

/**
 * Updates the logged in department's mission statement for a specific assessment
 */
exports.updateMissionStatement = function (req, res, next) {
	//Get the assessment id and mission statement parameters
	var assessmentId = req.body.assessmentId;
	var missionStatement = req.body.missionStatement;

	//Make sure both of these were sent and are defined
	if (!assessmentId) {
		res.json(error(strings.noEvaluationIdGiven));
		return;
	}

	if (!missionStatement) {
		res.json(error(strings.noMissionStatementFound));
		return;
	}

	//Make sure the user is logged in
	if (req.user) {
		//Get the department's object from the database
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				//Find the evaluation for this year
				var evaluations = department.evaluations;
				var evaluationForYear = evaluations.find(function (elem) {
					return elem.id === assessmentId;
				});

				if (evaluationForYear) {
					var evaluationObj = evaluationForYear.evaluation;

					//Set the mission statement and save the object back to the database
					evaluationObj.data.info = missionStatement;

					department.save(function (err) {
						if (err) {
							next(err);
						} else {
							res.json(success());
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

/**
 * Deletes an assessment for a given year
 */
exports.delete = function(req, res, next) {
	//Get the id of the assessment to delete
	var assessmentId = req.body.assessmentId;

	//Make sure it is defined and was sent
	if (!assessmentId) {
		res.json(error(strings.noEvaluationIdGiven));
		return;
	}

	//Make sure the user is logged in
	if (req.user) {
		//Get the department's object from the database
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				//Find the index of the evaluation with the given id
				var evaluations = department.evaluations;
				var i1;
				for (i1 = 0; i1 < evaluations.length; i1++) {
					if (evaluations[i1].id === assessmentId) {
						break;
					}
				}

				//Make sure the index was found. If found, delete the assessment and save
				if (i1 !== evaluations.length) {
					evaluations.splice(i1, 1);
					department.save(function (err) {
						if (err) {
							next(err);
						} else {
							res.json(success());
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

/**
 * Creates a new empty goal with an id for a given evaluation year
 */
exports.createGoal = function(req, res, next) {
	var year = req.body.year;

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

exports.createSLO = function(req, res, next) {
	var year = req.body.year;
	var goalId = req.body.goalId;

	var id = mongoose.Types.ObjectId();

	var sloObj = {
		_id: id,
		label: '',
		data: {
			info: '',
			tool: '',
			target: '',
			result: '',
			targetAchieved: true
		}
	};

	if (req.user) {
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			var evaluations = department.evaluations;

			var evaluationForYear = evaluations.find(function (elem) {
				return elem.year === year;
			});

			if (evaluationForYear) {
				var evaluationObj = evaluationForYear.evaluation;
				var goals = evaluationObj.children;

				var goal = goals.find(function (elem) {
					return elem.id === goalId;
				});

				if (goal) {
					var slos = goal.children;
					slos.push(sloObj);

					department.save(function (err) {
						if (err) {
							next(err);
						} else {
							res.json(success({sloId: id}));
						}
					});
				} else {
					res.json(error(strings.noGoalFound));
				}
			} else {
				res.json(error(strings.noEvaluationFound));
			}
		});
	} else {
		res.json(error(strings.notLoggedIn));
	}
};

/**
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
	var id = req.params.id;

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
					return elem.id === id;
				});
				if (eval) {
					res.json(eval);
				} else {
					res.json(error(strings.noEvaluationFound));
				}
			}
		});
	} else {
		res.json(error(strings.notLoggedIn));
	}
};

var success = function (data) {
	return {
		success: true,
		data: data || null
	};
}

var error = function (message) {
	return {
		success: false,
		message: message
	};
}