//Initializes the database with all of the accounts for each department.
//This should only be run when the application is first installed.

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config');
var mongoose = require('mongoose');
var crypto = require('crypto');

var db = mongoose.connect(config.db);

require('./app/models/database.model');

var Assessment = mongoose.model('Assessment');

var departments = [
	'Anthropology/Sociology',
	'Art History',
	'Behavioral Neuroscience',
	'Biochemistry & Molecular Biology',
	'Biology',
	'Chemical Physics',
	'Chemistry',
	'Classical Studies',
	'Computer Science',
	'Dramatic Arts',
	'Economics and Finance',
	'English',
	'Environmental Studies',
	'French',
	'German Studies',
	'History',
	'International Studies',
	'Mathematics',
	'Music',
	'Philosophy',
	'Physics',
	'Politics',
	'Psychology',
	'Religion',
	'Spanish',
	'Studio Art'
];

for (var i1 = 0; i1 < departments.length; i1++) {
	var dept = departments[i1];
	
	var pass = crypto.randomBytes(5).toString('hex');

	var assessment = new Assessment({
		department: dept,
		password: pass
	});

	console.log(dept + " - " + pass);
	
	assessment.save(function (err) {
		if (err) {
			console.log(err);
		}
	});
}