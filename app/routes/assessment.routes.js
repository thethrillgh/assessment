var assessment = require('../controllers/assessment.controller');

module.exports = function (app) {
	app.get('/assessments', assessment.readAssessments);
	app.get('/assessment/:id', assessment.readAssessment);

	app.route('/assessment')
		.post(assessment.create)
		.delete(assessment.delete);
		
	app.put('/missionStatement', assessment.updateMissionStatement);

	app.route('/goal')
		.post(assessment.createGoal)
		.put(assessment.updateGoal)
		.delete(assessment.deleteGoal);

	app.route('/slo')
		.post(assessment.createSLO)
		.put(assessment.updateSLO)
		.delete(assessment.deleteSLO);

	app.route('/process')
		.post(assessment.createProcess)
		.put(assessment.updateProcess)
		.delete(assessment.deleteProcess);

	app.put('/result', assessment.updateResult);



	/* app.post('/assessment', assessment.create);
	app.post('/goal', assessment.createGoal);
	app.post('/slo', assessment.createSLO);
	app.post('/process', assessment.createProcess);

	app.put('/updateMissionStatement', assessment.updateMissionStatement);
	app.put('/updateGoal', assessment.updateGoal);
	app.put('/updateSLO', assessment.updateSLO);
	app.put('/updateProcess', assessment.updateProcess);

	app.delete('/deleteEvaluation', assessment.delete);
	app.delete('/deleteGoal', assessment.deleteGoal);
	app.delete('/deleteSLO', assessment.deleteSLO);
	app.delete('/deleteProcess', assessment.deleteProcess); */
};