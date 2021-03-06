var mongoose = require('mongoose');

module.exports = function(app) {
	mongoose.connect('mongodb://localhost/examen');

	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var User = mongoose.model('User', new Schema({
		id: ObjectId,
		firstName: String,
		lastName: String,
		email: { type: String, unique: true },
		password: String
	}));
}