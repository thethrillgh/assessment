process.env.NODE_ENV = 'testing';
process.env.PORT = 8081;

var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

var server = require('../server');

var strings = require('../config/strings');

var department = 'Computer Science';
var incorrectDepartment = 'Computerr Science';
var password = 'password';
var incorrectPassword = 'incorrect';
var assessments = [
	{
		year: '2016-2017',
		missionStatement: 'The Computer Science Program seeks to produce graduates who are able to research and analyze ...',
		goals: [
			{
				goal: 'possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology',
				slos: [
					{
						slo: 'Students will have an appropriate foundation in the core knowledge areas',
						processes: [
							{
								process: 'We use several tools for measuring students’ knowledge in the core curriculum. The ETS exam...',
								result: 'The following table gives the results for the last five years:......'
							}
						]
					},
					{
						slo: 'Students will be able to successfully implement a significant programming project from needs analysis to implementation and testing',
						processes: [
							{
								process: 'To assess the students’ ability to carry out a significant project, we first make sure that all students complete a project course at Centre (currently CSC 336, Software Engineering or CSC 410 Database Systems)',
								result: '100% of the graduates completed a project course'
							}
						]
					}
				]
			},
			{
				goal: 'develops the capacities to learn independently, work collaboratively, and communicate effectively',
				slos: [
					{
						slo: 'Students will be able to work collaboratively on a group project',
						processes: [
							{
								process: 'To assess students’ ability to work collaboratively, we ask a question',
								result: 'In the online survey, question 25:, 93% agreed'
							}
						]
					},
					{
						slo: 'Students will be able to clearly and effectively communicate technical material both orally and in writing',
						processes: [
							{
								process: 'To assess the ability of students to communicate both in writing and orally...',
								result: 'Online survey, 86% agreed or strongly agreed'
							}
						]
					}
				]
			},
			{
				goal: 'is prepared to function as a professional computer scientist or to enter graduate school',
				slos: [
					{
						slo: 'Students will be prepared to enter graduate or professional school or to begin a career in a computing-related field',
						processes: [
							{
								process: 'We want our students to be prepared to enter professional careers as computer scientists or software engineers...',
								result: 'The Centre College Center for Career and Professional Development was able to report information on eight of the nine 2015 graduates'
							}
						]
					}
				]
			}
		]
	},
	{
		year: '2015-2016',
		missionStatement: 'The Computer Science Program seeks to produce graduates who are able to research and analyze ...',
		goals: [
			{
				goal: 'possesses the core content knowledge of the discipline as well as an awareness of the ethical and social implications of computing technology',
				slos: [
					{
						slo: 'Students will have an appropriate foundation in the core knowledge areas',
						processes: [
							{
								process: 'We use several tools for measuring students’ knowledge in the core curriculum. The ETS exam...',
								result: 'The following table gives the results for the last five years:......'
							}
						]
					},
					{
						slo: 'Students will be able to successfully implement a significant programming project from needs analysis to implementation and testing',
						processes: [
							{
								process: 'To assess the students’ ability to carry out a significant project, we first make sure that all students complete a project course at Centre (currently CSC 336, Software Engineering or CSC 410 Database Systems)',
								result: '100% of the graduates completed a project course'
							}
						]
					}
				]
			},
			{
				goal: 'develops the capacities to learn independently, work collaboratively, and communicate effectively',
				slos: [
					{
						slo: 'Students will be able to work collaboratively on a group project',
						processes: [
							{
								process: 'To assess students’ ability to work collaboratively, we ask a question',
								result: 'In the online survey, question 25:, 93% agreed'
							}
						]
					},
					{
						slo: 'Students will be able to clearly and effectively communicate technical material both orally and in writing',
						processes: [
							{
								process: 'To assess the ability of students to communicate both in writing and orally...',
								result: 'Online survey, 86% agreed or strongly agreed'
							}
						]
					}
				]
			},
			{
				goal: 'is prepared to function as a professional computer scientist or to enter graduate school',
				slos: [
					{
						slo: 'Students will be prepared to enter graduate or professional school or to begin a career in a computing-related field',
						processes: [
							{
								process: 'We want our students to be prepared to enter professional careers as computer scientists or software engineers...',
								result: 'The Centre College Center for Career and Professional Development was able to report information on eight of the nine 2015 graduates'
							}
						]
					}
				]
			}
		]
	}
];

before(function (done) {
	var mongoose = require('mongoose');
	var Assessment = mongoose.model('Assessment');

	//Clear out the testing database, and create a new entry for this department
	Assessment.remove({}, function () {
		var assessment = new Assessment({
			department: department,
			password: password
		});

		assessment.save(function (err) {
			done();
		});
	});
});

describe('Logging in', function () {
	it('Can give a correct error message when given incorrect password', function (done) {
		chai.request(server).post('/signin')
			.send({
				department: department,
				password: incorrectPassword
			}).end(function (err, res) {
				expect(res).to.have.status(200);

				var obj = JSON.parse(res.text);
				expect(obj.success).is.deep.equal(false);
				expect(obj.message).is.deep.equal(strings.incorrectPassword);

				done();
			});
	});
	
	
	it("Can successfully login with the correct uername and password", function (done){
		chai.request(server).post('/signin')
			.send({
				department: department,
				password: password
			}).end(function (err, res){
				expect(res).to.have.status(200);
			
				var obj = JSON.parse(res.text);
				expect(obj.success).is.deep.equal(true);

				done();
			})
	})
	
	it("Can give a correct error message when using a user name that is not existing", function (done){
		chai.request(server).post('/signin')
			.send({
				department: incorrectDepartment,
				password: password
			}).end(function (err, res) {
				expect(res).to.have.status(200);

				var obj = JSON.parse(res.text);
				expect(obj.success).is.deep.equal(false);
				expect(obj.message).is.deep.equal(strings.noUserFound);

				done();
			});
	})
	
	it("Can give a correct error message when not sending data to the server",function (done){
		chai.request(server).post('/signin')
			.send({}).end(function (err, res) {
				expect(res).to.have.status(200);

				var obj = JSON.parse(res.text);
				expect(obj.success).is.deep.equal(false);
				expect(obj.message).is.deep.equal("Missing credentials");

				done();
			});
	});
});


describe("Assessment operations are working",function (){
	before(function (done) {
		server.request.user = {
			department: department
		};
		done();
	});
	
	assessments.forEach(function (elem) {
		it("Can create a new assessment for the year: " + elem.year, function (done) {
			chai.request(server).post('/assessment')
				.send({
					year: elem.year
				}).end(function (err,res){
					expect(res).to.have.status(200);
					var obj = JSON.parse(res.text);
				
					expect(obj.success).is.deep.equal(true);
					expect(obj.data.assessmentId).to.exist;

					elem.assessmentId = obj.data.assessmentId;

					done();
				});
		});
	});

	assessments.forEach(function (elem) {
		it('Can update the mission statement', function (done) {
			chai.request(server).put('/missionStatement')
				.send({
					assessmentId: elem.assessmentId,
					missionStatement: elem.missionStatement
				}).end(function (err, res) {
					expect(res).to.have.status(200);

					var obj = JSON.parse(res.text);
					expect(obj.success).is.deep.equal(true);

					done();
				});
		});
	});

	assessments.forEach(function (elem) {
		elem.goals.forEach(function (goal) {
			it('Can create a new goal', function (done) {
				chai.request(server).post('/goal')
					.send({
						assessmentId: elem.assessmentId
					}).end(function (err, res) {
						expect(res).to.have.status(200);

						var obj = JSON.parse(res.text);
						expect(obj.success).is.deep.equal(true);

						expect(obj.data.goalId).to.exist;

						goal.goalId = obj.data.goalId;

						done();
					});
			});
		});
	});

	assessments.forEach(function (elem) {
		elem.goals.forEach(function (goal) {
			it('Can update a goal', function (done) {
				chai.request(server).put('/goal')
					.send({
						assessmentId: elem.assessmentId,
						goalId: goal.goalId,
						goal: goal.goal,
						goalName: 'Goal'
					}).end(function (err, res) {
						expect(res).to.have.status(200);

						var obj = JSON.parse(res.text);
						expect(obj.success).is.deep.equal(true);

						done();
					});
			});
		});
	});

	assessments.forEach(function (elem) {
		elem.goals.forEach(function (goal) {
			goal.slos.forEach(function (slo) {
				it('Can create a new Student Learning Objective', function (done) {
					chai.request(server).post('/slo')
						.send({
							assessmentId: elem.assessmentId,
							goalId: goal.goalId
						}).end(function (err, res) {
							expect(res).to.have.status(200);

							var obj = JSON.parse(res.text);
							expect(obj.success).to.deep.equal(true);

							expect(obj.data.sloId).to.exist;

							slo.sloId = obj.data.sloId;

							done();
						});
				});
			});
		});
	});

	assessments.forEach(function (elem) {
		elem.goals.forEach(function (goal) {
			goal.slos.forEach(function (slo) {
				it('Can update a Student Learning Objective', function (done) {
					chai.request(server).put('/slo')
						.send({
							assessmentId: elem.assessmentId,
							goalId: goal.goalId,
							sloId: slo.sloId,
							updatedSLO: slo.slo,
							sloName: 'SLO'
						}).end(function (err, res) {
							expect(res).to.have.status(200);

							var obj = JSON.parse(res.text);
							expect(obj.success).to.deep.equal(true);

							done();
						});
				});
			});
		});
	});

	assessments.forEach(function (elem) {
		elem.goals.forEach(function (goal) {
			goal.slos.forEach(function (slo) {
				slo.processes.forEach(function (proces) {
					it('Can create a new process', function (done) {
						chai.request(server).post('/process')
							.send({
								assessmentId: elem.assessmentId,
								goalId: goal.goalId,
								sloId: slo.sloId
							}).end(function (err, res) {
								expect(res).to.have.status(200);

								var obj = JSON.parse(res.text);
								expect(obj.success).to.deep.equal(true);

								expect(obj.data.processId).to.exist;

								proces.processId = obj.data.processId;

								done();
							});
					});
				});
			});
		});
	});

	assessments.forEach(function (elem) {
		elem.goals.forEach(function (goal) {
			goal.slos.forEach(function (slo) {
				slo.processes.forEach(function (proces) {
					it('Can update a process', function (done) {
						chai.request(server).put('/process')
							.send({
								assessmentId: elem.assessmentId,
								goalId: goal.goalId,
								sloId: slo.sloId,
								processId: proces.processId,
								updatedProcess: proces.process,
								processName: 'Process'
							}).end(function (err, res) {
								expect(res).to.have.status(200);

								var obj = JSON.parse(res.text);
								expect(obj.success).to.deep.equal(true);

								done();
							});
					});
				});
			});
		});
	});

	assessments.forEach(function (elem) {
		elem.goals.forEach(function (goal) {
			goal.slos.forEach(function (slo) {
				slo.processes.forEach(function (proces) {
					it('Can update a result', function (done) {
						chai.request(server).put('/result')
							.send({
								assessmentId: elem.assessmentId,
								goalId: goal.goalId,
								sloId: slo.sloId,
								processId: proces.processId,
								updatedResult: proces.result,
								resultName: 'Result'
							}).end(function (err, res) {
								expect(res).to.have.status(200);

								var obj = JSON.parse(res.text);
								expect(obj.success).to.deep.equal(true);

								done();
							});
					});
				});
			});
		});
	});

	it('Can get all assessments from the database', function (done) {
		chai.request(server).get('/assessments')
			.end(function (err, res) {
				expect(res).to.have.status(200);

				var obj = JSON.parse(res.text);
				expect(obj.success).to.deep.equal(true);
				expect(obj.data).to.exist;

				var evaluations = obj.data.evaluations;
				evaluations.forEach(function (evaluationObj) {
					var evaluationLocal = assessments.find(function (elem) {
						return elem.assessmentId === evaluationObj.id;
					});

					expect(evaluationObj.year).to.deep.equal(evaluationLocal.year);

					var evaluation = evaluationObj.evaluation;
					expect(evaluation.data.info).to.deep.equal(evaluationLocal.missionStatement);

					var goalsFromServer = evaluation.children;
					goalsFromServer.forEach(function (goalFromServer) {
						var goalFound = evaluationLocal.goals.find(function (g) {
							return g.goal === goalFromServer.data.info;
						});

						expect(goalFromServer.data.info).to.deep.equal(goalFound.goal);

						var slosFromServer = goalFromServer.children;
						slosFromServer.forEach(function (sloFromServer) {
							var sloFound = goalFound.slos.find(function (s) {
								return s.slo === sloFromServer.data.info;
							});

							expect(sloFromServer.data.info).to.deep.equal(sloFound.slo);

							var processesFromServer = sloFromServer.children;
							processesFromServer.forEach(function (processFromServer) {
								var processFound = sloFound.processes.find(function (p) {
									return p.process === processFromServer.data.info;
								});

								expect(processFromServer.data.info).to.deep.equal(processFound.process);
								expect(processFromServer.children[0].data.info).to.deep.equal(processFound.result);
							});
						});
					});
				});

				done();
			});
	});

	assessments.forEach(function (elem) {
		it('Can get a specific assessment from the database', function (done) {
			chai.request(server).get('/assessment/' + elem.assessmentId)
				.end(function (err, res) {
					expect(res).to.have.status(200);

					var obj = JSON.parse(res.text);
					expect(obj.success).to.deep.equal(true);
					expect(obj.data).to.exist;

					var assessment = obj.data.evaluation;

					expect(assessment.year).to.deep.equal(elem.year);

					var evaluation = assessment.evaluation;
					expect(evaluation.data.info).to.deep.equal(elem.missionStatement);

					var goalsFromServer = evaluation.children;
					goalsFromServer.forEach(function (goalFromServer) {
						var goalFound = elem.goals.find(function (g) {
							return g.goal === goalFromServer.data.info;
						});

						expect(goalFromServer.data.info).to.deep.equal(goalFound.goal);

						var slosFromServer = goalFromServer.children;
						slosFromServer.forEach(function (sloFromServer) {
							var sloFound = goalFound.slos.find(function (s) {
								return s.slo === sloFromServer.data.info;
							});

							expect(sloFromServer.data.info).to.deep.equal(sloFound.slo);

							var processesFromServer = sloFromServer.children;
							processesFromServer.forEach(function (processFromServer) {
								var processFound = sloFound.processes.find(function (p) {
									return p.process === processFromServer.data.info;
								});

								expect(processFromServer.data.info).to.deep.equal(processFound.process);
								expect(processFromServer.children[0].data.info).to.deep.equal(processFound.result);
							});
						});
					});

					done();
				});
		});
	});

	/* assessments.forEach(function (elem) {
		elem.goals.forEach(function (goal) {
			goal.slos.forEach(function (slo) {
				slo.processes.forEach(function (proces) {
					it('Can delete a process', function (done) {
						chai.request(server).delete('/process')
							.send({
								assessmentId: elem.assessmentId,
								goalId: goal.goalId,
								sloId: slo.sloId,
								processId: proces.processId
							}).end(function (err, res) {
								expect(res).to.have.status(200);

								var obj = JSON.parse(res.text);
								expect(obj.success).to.deep.equal(true);

								done();
							});
					});
				});
			})
		});
	});

	assessments.forEach(function (elem) {
		elem.goals.forEach(function (goal) {
			goal.slos.forEach(function (slo) {
				it('Can delete a Student Learning Objective', function (done) {
					chai.request(server).delete('/slo')
						.send({
							assessmentId: elem.assessmentId,
							goalId: goal.goalId,
							sloId: slo.sloId
						}).end(function (err, res) {
							expect(res).to.have.status(200);

							var obj = JSON.parse(res.text);
							expect(obj.success).to.deep.equal(true);

							done();
						});
				});
			})
		});
	});

	assessments.forEach(function (elem) {
		elem.goals.forEach(function (goal) {
			it('Can delete a goal', function (done) {
				chai.request(server).delete('/goal')
					.send({
						assessmentId: elem.assessmentId,
						goalId: goal.goalId
					}).end(function (err, res) {
						expect(res).to.have.status(200);

						var obj = JSON.parse(res.text);
						expect(obj.success).to.deep.equal(true);

						done();
					});
			});
		});
	});

	assessments.forEach(function (elem) {
		it('Can delete the assessment', function (done) {
			chai.request(server).delete('/assessment')
				.send({
					assessmentId: elem.assessmentId
				}).end(function (err, res) {
					expect(res).to.have.status(200);

					var obj = JSON.parse(res.text);
					expect(obj.success).to.deep.equal(true);

					done();
				});
		});
	}); */
});