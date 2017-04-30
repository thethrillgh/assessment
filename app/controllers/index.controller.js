var Assessment = require('mongoose').model('Assessment');

exports.render = function (req, res) {
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
		var department = departments[i1];
		var assessment = new Assessment({
			department: department
		});
		assessment.save(function (err) {
			if (err) {
				console.log(err);
			} else {
				res.json(assessment);
			}
		})
	}
};