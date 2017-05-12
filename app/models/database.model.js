var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var crypto = require('crypto');

var AssessmentSchema = new Schema({
	department: String,
	password: String,
	salt: String,
	evaluations: [
		{
			year: String,
			changedGoals: Boolean,
			changedSLOs: Boolean,
			evaluation: { //This is what is passed to the angular tree
				label: String, //Mission statement
				data: {
					info: String
				},
				children: [ //Goals
					{
						label: String,
						data: {
							info: String
						},
						children: [ //Student Learning Objectives
							{
								label: String,
								data: {
									info: String
								},
								children: [ //Processes and results
									{
										label: String, //Process
										data: {
											info: String
										},
										children: [ //Results
											{
												label: String,
												data: {
													info: String
												}
											}
										]
									}
								]
							}
						]
					}
				]
			}
		}
	]
});

AssessmentSchema.pre('save', function(next) {
	if (this.password) {
		this.salt = crypto.randomBytes(16).toString('base64');
		//this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

AssessmentSchema.methods.hashPassword = function(password) {
	return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
};

AssessmentSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

AssessmentSchema.set('toJSON', {
	getters: true,
	setters: true
});

mongoose.model('Assessment', AssessmentSchema);