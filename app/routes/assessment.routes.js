var assessment = require('../controllers/assessment.controller');

module.exports = function (app) {
	app.get('/assessments', assessment.readAssessments);

	app.get('/assessment/:id', assessment.readAssessment);

	app.post('/newAssessment', assessment.create);
	app.post('/newGoal', assessment.createGoal);
	app.post('/newSLO', assessment.createSLO);
};