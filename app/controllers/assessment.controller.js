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
 	var assessmentId = req.body.assessmentId;

	//Go ahead and generate id for the goal, so it can easily be returned
	var goalId = mongoose.Types.ObjectId();

	//Init goal object with empty body info
	var goalObj = {
		_id: goalId,
		label: 'Goal',
		data: {
			info: ''
		}
	};

	//Make sure the user is logged in
	if (req.user) {
		//Make sure the assessment id was sent correctly
		if (assessmentId) {
			//Get the department object from the database
			Assessment.findOne({
				department: req.user.department
			}, 'evaluations', function (err, department) {
				if (err) {
					next(err);
				} else {
					var evaluations = department.evaluations;

					//Find the evaluation for the given year
					var evaluationForYear = evaluations.find(function (elem) {
						return elem.id === assessmentId;
					});

					//Make sure the evaluation for given year exists
					if (evaluationForYear) {
						var evaluationObj = evaluationForYear.evaluation;

						//Push the new goal onto the goals array
						var goals = evaluationObj.children;
						goals.push(goalObj);

						//Save it to the database
						department.save(function (err) {
							if (err) {
								next(err);
							} else {
								res.json(success({goalId: goalId}));
							}
						});
					} else {
						res.json(error(strings.noEvaluationFound));
					}
				}
			});
		} else {
			res.json(error(strings.noEvaluationIdGiven));
		}
	} else {
		res.json(error(strings.notLoggedIn));
	}
};

/**
 * Updates the information for a goal
 */
exports.updateGoal = function (req, res, next) {
	//Find the three things from the body needed
	var assessmentId = req.body.assessmentId;
	var goalId = req.body.goalId;
	var goalUpdate = req.body.goal;

	//Make sure each of these three things are given
	if (!assessmentId) {
		res.json(error(strings.noEvaluationIdGiven));
		return;
	}

	if (!goalId) {
		res.json(error(strings.noGoalIdGiven));
		return;
	}

	if (!goalUpdate) {
		res.json(error(strings.noGoalGiven));
		return;
	}

	//Make sure the user is logged in
	if (req.user) {
		//Get the department object from the database
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				var evaluations = department.evaluations;

				//Find the evaluation for this year (for the id given)
				var evaluationForYear = evaluations.find(function (elem) {
					return elem.id === assessmentId;
				});

				//Make sure the evaluation is found
				if (evaluationForYear) {
					var evaluationObj = evaluationForYear.evaluation;

					var goals = evaluationObj.children;

					//Find the goal with the given id
					var goal = goals.find(function (elem) {
						return elem.id === goalId;
					});

					//Make sure the goal is found
					if (goal) {
						//Set the goal
						goal.data.info = goalUpdate;

						//Save it back to the database
						department.save(function (err) {
							if (err) {
								next(err);
							} else {
								res.json(success());
							}
						});
					} else {
						res.json(error(strings.noGoalFound));
					}
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
 * Deletes a goal from the database for an assessment
 */
exports.deleteGoal = function (req, res, next) {
	//Get the assessment and goal ids
	var assessmentId = req.body.assessmentId;
	var goalId = req.body.goalId;

	//Make sure they are set correctly
	if (!assessmentId) {
		res.json(error(strings.noEvaluationIdGiven));
		return;
	}

	if (!goalId) {
		res.json(error(strings.noGoalIdGiven));
		return;
	}

	//Make sure the user is logged in
	if (req.user) {
		//Get the department object from the database
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				//Find the evaluation for that year (for the id given)
				var evaluations = department.evaluations;
				var evaluationForYear = evaluations.find(function (elem) {
					return elem.id === assessmentId;
				});

				if (evaluationForYear) {
					var evaluationObj = evaluationForYear.evaluation;

					//Find the id of the goal to delete
					var goals = evaluationObj.children;
					var i1;
					for (i1 = 0; i1 < goals.length; i1++) {
						if (goals[i1].id === goalId) {
							break;
						}
					}

					//Make sure the goal is found, and delete it
					if (i1 !== goals.length) {
						goals.splice(i1, 1);

						//Save it back to the database
						department.save(function (err) {
							if (err) {
								next(err);
							} else {
								res.json(success());
							}
						});
					} else {
						res.json(error(strings.noGoalFound));
					}
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
 * Creates a new empty SLO for a given year and goal id, and sends the SLO id back to the client
 */
exports.createSLO = function(req, res, next) {
	//Get the assessment and goal id to create the slo for
	var assessmentId = req.body.assessmentId;
	var goalId = req.body.goalId;

	//Make sure they are sent correctly
	if (!assessmentId) {
		res.json(strings.noEvaluationIdGiven);
		return;
	}

	if (!goalId) {
		res.json(strings.noGoalIdGiven);
		return;
	}

	//Generate the id and the slo object to be added
	var id = mongoose.Types.ObjectId();

	var sloObj = {
		_id: id,
		label: 'SLO',
		data: {
			info: ''
		}
	};

	//Make sure the user is logged in
	if (req.user) {
		//Get the department object from the database
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			//Find the evaluation object for this year
			var evaluations = department.evaluations;
			var evaluationForYear = evaluations.find(function (elem) {
				return elem.id === assessmentId;
			});

			if (evaluationForYear) {
				var evaluationObj = evaluationForYear.evaluation;

				//Find the goal object
				var goals = evaluationObj.children;
				var goal = goals.find(function (elem) {
					return elem.id === goalId;
				});

				//Make sure the goal is found
				if (goal) {
					//Add the SLO to the array
					var slos = goal.children;
					slos.push(sloObj);

					//Save it back to the database
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
 * Updates a Student Learning Objective
 */
exports.updateSLO = function (req, res, next) {
	//Get all the needed parameters for the SLO update
	var assessmentId = req.body.assessmentId;
	var goalId = req.body.goalId;
	var sloId = req.body.sloId;
	var updatedSLO = req.body.updatedSLO;

	//Make sure they are all set
	if (!assessmentId) {
		res.json(error(strings.noEvaluationIdGiven));
		return;
	}

	if (!goalId) {
		res.json(error(strings.noGoalIdGiven));
		return;
	}

	if (!sloId) {
		res.json(error(strings.noSLOIdGiven));
		return;
	}

	if (!updatedSLO) {
		res.json(error(strings.noSLOGiven));
		return;
	}

	//Mission Statement > Goals > SLOs > Processes and Results

	//Make sure the user is logged in
	if (req.user) {
		//Get the department object from the database
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				//Find the evaluation for the wanted year
				var evaluations = department.evaluations;
				var evaluationForYear = evaluations.find(function (elem) {
					return elem.id === assessmentId;
				});

				//Make sure the evaluation is found
				if (evaluationForYear) {
					var evaluationObj = evaluationForYear.evaluation;

					//Find the goal object
					var goals = evaluationObj.children;
					var goal = goals.find(function (elem) {
						return elem.id === goalId;
					});

					//Make sure the goal is found
					if (goal) {
						//Find the SLO object
						var slos = goal.children;
						var slo = slos.find(function (elem) {
							return elem.id === sloId;
						});

						//Make sure the SLO is found
						if (slo) {
							//Update the info of the SLO
							slo.data.info = updatedSLO;

							//Save it back to the database
							department.save(function (err) {
								if (err) {
									next(err);
								} else {
									res.json(success());
								}
							})
						} else {
							res.json(error(strings.noSLOFound));
						}
					} else {
						res.json(error(strings.noGoalFound));
					}
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
 * Deletes a Student Learning Objective from the database
 */
exports.deleteSLO = function (req, res, next) {
	//Get the assessment, goal, and SLO id
	var assessmentId = req.body.assessmentId;
	var goalId = req.body.goalId;
	var sloId = req.body.sloId;

	//Make sure all of these are set
	if (!assessmentId) {
		res.json(error(strings.noEvaluationIdGiven));
	}

	if (!goalId) {
		res.json(error(strings.noGoalIdGiven));
	}

	if (!sloId) {
		res.json(error(strings.noSLOIdGiven));
	}

	//Make sure the user is logged in
	if (req.user) {
		//Get the department object from the database
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				//Find the evaluation for the wanted year
				var evaluations = department.evaluations;
				var evaluationForYear = evaluations.find(function (elem) {
					return elem.id === assessmentId;
				});

				//Make sure the evaluation is found
				if (evaluationForYear) {
					var evaluationObj = evaluationForYear.evaluation;

					//Find the goal object
					var goals = evaluationObj.children;
					var goal = goals.find(function (elem) {
						return elem.id === goalId;
					});

					//Make sure the goal is found
					if (goal) {
						//Find the index of the SLO to delete
						var slos = goal.children;
						var i1;
						for (i1 = 0; i1 < slos.length; i1++) {
							if (slos[i1].id === sloId) {
								break;
							}
						}

						//Make sure the index is found for the SLO, and delete it
						if (i1 !== slos.length) {
							slos.splice(i1, 1);

							//Save the department back to the database
							department.save(function (err) {
								if (err) {
									next(err);
								} else {
									res.json(success());
								}
							});
						} else {
							res.json(error(strings.noSLOFound));
						}
					} else {
						res.json(error(strings.noGoalFound));
					}
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
 * Creates a new process and result under a SLO
 */
exports.createProcess = function (req, res, next) {
	//Get the assessment, goal, and SLO id
	var assessmentId = req.body.assessmentId;
	var goalId = req.body.goalId;
	var sloId = req.body.sloId;

	//Make sure all required parameters were sent
	if (!assessmentId) {
		res.json(error(strings.noEvaluationIdGiven));
		return;
	}

	if (!goalId) {
		res.json(error(strings.noGoalIdGiven));
		return;
	}

	if (!sloId) {
		res.json(error(strings.noSLOIdGiven));
		return;
	}

	//Create empty process and result object with id
	var id = mongoose.Types.ObjectId();

	var processObj = {
		_id: id,
		label: 'Process',
		data: {
			info: ''
		},
		children: [
			{
				label: 'Result',
				data: {
					info: ''
				}
			}
		]
	};

	//Make sure the user is logged in
	if (req.user) {
		//Get the department object
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				//Find the evaluation for the year (for the given id)
				var evaluations = department.evaluations;
				var evaluationForYear = evaluations.find(function (elem) {
					return elem.id === assessmentId;
				});

				//Make sure the evaluation is found
				if (evaluationForYear) {
					var evaluationObj = evaluationForYear.evaluation;

					//Find the goal for the id
					var goals = evaluationObj.children;
					var goal = goals.find(function (elem) {
						return elem.id === goalId;
					});

					//Make sure the goal is found
					if (goal) {
						//Find the SLO for the id
						var slos = goal.children;
						var slo = slos.find(function (elem) {
							return elem.id === sloId;
						});

						//Push the process object onto the SLO's children
						var processes = slo.children;
						processes.push(processObj);

						//Save it back to the database
						department.save(function (err) {
							if (err) {
								next(err);
							} else {
								res.json(success({processId: id}));
							}
						})
					} else {
						res.json(error(strings.noGoalFound));
					}
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
 * Updates a process
 */
exports.updateProcess = function (req, res, next) {
	//Get all the needed ids
	var assessmentId = req.body.assessmentId;
	var goalId = req.body.goalId;
	var sloId = req.body.sloId;
	var processId = req.body.processId;
	var updatedProcess = req.body.updatedProcess;

	//Make sure everything is sent correctly
	if (!assessmentId) {
		res.json(error(strings.noEvaluationIdGiven));
		return;
	}

	if (!goalId) {
		res.json(error(strings.noGoalIdGiven));
		return;
	}

	if (!sloId) {
		res.json(error(strings.noSLOIdGiven));
		return;
	}

	if (!processId) {
		res.json(error(strings.noProcessIdGiven));
		return;
	}

	if (!updatedProcess) {
		res.json(error(strings.noProcessGiven));
		return;
	}

	//Make sure the user is logged in
	if (req.user) {
		//Get the department object from the database
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				//Find the evaluation for this year (for the given id)
				var evaluations = department.evaluations;
				var evaluationForYear = evaluations.find(function (elem) {
					return elem.id === assessmentId;
				});

				//Make sure the evaluation object is found
				if (evaluationForYear) {
					var evaluationObj = evaluationForYear.evaluation;

					//Find the goal object
					var goals = evaluationObj.children;
					var goal = goals.find(function (elem) {
						return elem.id === goalId;
					});

					//Make sure the goal is found
					if (goal) {
						//Find the slo object
						var slos = goal.children;
						var slo = slos.find(function (elem) {
							return elem.id === sloId;
						});

						//Make sure the slo is found
						if (slo) {
							//Find the process to update
							var processes = slo.children;
							var proces = processes.find(function (elem) {
								return elem.id === processId;
							});

							//Update the process
							proces.data.info = updatedProcess;

							//Save it back to the database
							department.save(function (err) {
								if (err) {
									next(err);
								} else {
									res.json(success());
								}
							});
						} else {
							res.json(error(strings.noSLOFound));
						}
					} else {
						res.json(error(strings.noGoalFound));
					}
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
 * Deletes a process from the database
 */
exports.deleteProcess = function (req, res, next) {
	//Get all the needed ids
	var assessmentId = req.body.assessmentId;
	var goalId = req.body.goalId;
	var sloId = req.body.sloId;
	var processId = req.body.processId;

	//Make sure everything is sent properly
	if (!assessmentId) {
		res.json(error(strings.noEvaluationIdGiven));
		return;
	}

	if (!goalId) {
		res.json(error(strings.noGoalIdGiven));
		return;
	}

	if (!sloId) {
		res.json(error(strings.noSLOIdGiven));
		return;
	}

	if (!processId) {
		res.json(error(strings.noProcessIdGiven));
		return;
	}

	//Make sure the user is logged in
	if (req.user) {
		//Get the department object from the database
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				//Find the evaluation for this year (for the given id)
				var evaluations = department.evaluations;
				var evaluationForYear = evaluations.find(function (elem) {
					return elem.id === assessmentId;
				});

				//Make sure the evaluation is found
				if (evaluationForYear) {
					var evaluationObj = evaluationForYear.evaluation;

					//Find the goal object
					var goals = evaluationObj.children;
					var goal = goals.find(function (elem) {
						return elem.id === goalId;
					});

					//Make sure the goal is found
					if (goal) {
						//Find the SLO object
						var slos = goal.children;
						var slo = slos.find(function (elem) {
							return elem.id === sloId;
						});

						//Make sure the SLO is found
						if (slo) {
							//Find the index of the process to delete
							var processes = slo.children;
							var i1;
							for (i1 = 0; i1 < processes.length; i1++) {
								if (processes[i1].id === processId) {
									break;
								}
							}

							//Make sure the process is found, and delete it
							if (i1 !== processes.length) {
								processes.splice(i1, 1);

								//Save it back to the database
								department.save(function (err) {
									if (err) {
										next(err);
									} else {
										res.json(success());
									}
								})
							} else {
								res.json(error(strings.noProcessFound));
							}
						} else {
							res.json(error(strings.noSLOFound));
						}
					} else {
						res.json(error(strings.noGoalFound));
					}
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
 * Updates a result for a process
 */
exports.updateResult = function (req, res, next) {
	//Get all the needed ids and the update
	var assessmentId = req.body.assessmentId;
	var goalId = req.body.goalId;
	var sloId = req.body.sloId;
	var processId = req.body.processId;
	var updatedResult = req.body.updatedResult;

	//Make sure everything was sent
	if (!assessmentId) {
		res.json(error(strings.noEvaluationIdGiven));
		return;
	}

	if (!goalId) {
		res.json(error(strings.noGoalIdGiven));
		return;
	}

	if (!sloId) {
		res.json(error(strings.noSLOIdGiven));
		return;
	}

	if (!processId) {
		res.json(error(strings.noProcessIdGiven));
		return;
	}

	if (!updatedResult) {
		res.json(error(strings.noResultGiven));
		return;
	}

	//Make sure the user is logged in
	if (req.user) {
		//Get the department object from the database
		Assessment.findOne({
			department: req.user.department
		}, 'evaluations', function (err, department) {
			if (err) {
				next(err);
			} else {
				//Find the evaluation object for this year (for the given id)
				var evaluations = department.evaluations;
				var evaluationForYear = evaluations.find(function (elem) {
					return elem.id === assessmentId;
				});

				//Make sure the evaluation is found
				if (evaluationForYear) {
					var evaluationObj = evaluationForYear.evaluation;

					//Find the goal object
					var goals = evaluationObj.children;
					var goal = goals.find(function (elem) {
						return elem.id === goalId;
					});

					//Make sure the goal is found
					if (goal) {
						//Find the SLO object
						var slos = goal.children;
						var slo = slos.find(function (elem) {
							return elem.id === sloId;
						});

						//Make sure the SLO is found
						if (slo) {
							//Find the process object
							var processes = slo.children;
							var proces = processes.find(function (elem) {
								return elem.id === processId;
							});

							//Make sure the process is found
							if (proces) {
								//Get the result object
								var resultArr = proces.children;
								var result = resultArr[0];

								//Update the result
								result.data.info = updatedResult;

								//Save it back to the database
								department.save(function (err) {
									if (err) {
										next(err);
									} else {
										res.json(success());
									}
								})
							} else {
								res.json(error(strings.noProcessFound));
							}
						} else {
							res.json(error(strings.noSLOFound));
						}
					} else {
						res.json(error(strings.noGoalFound));
					}
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