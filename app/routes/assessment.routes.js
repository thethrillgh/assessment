var assessment = require('../controllers/assessment.controller');

module.exports = function (app) {
	app.get('/assessments', assessment.readAssessments);
	app.get('/assessment', assessment.readAssessment);
	app.post('/newAssessment', assessment.create);

	app.get('/newGoal', assessment.createGoal);
	app.get('/newSLO', assessment.createSLO);

	//TODO These need to be changed to POST, and they need to be able to get the
	//needed parameters
};