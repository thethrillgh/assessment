var assessment = require('../controllers/assessment.controller');

module.exports = function (app) {
	app.get('/assessments', assessment.readAssessments);
	app.get('/assessment', assessment.readAssessment);
	app.post('/newAssessment', assessment.create);

	//app.route('/assessments').get(assessment.readAssessments);
	
	//app.route('/assessments')

	//app.route('assessment/:assessmentId').get()

	//app.param('')
};