const mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

var entry = new Schema({ 
	garageID: Number,
	capacity: Number,
	dateMonth: String, 
	dateDay: String, 
	dateYear: Number,
	hour: String,
	minute: String,
	second: String
});

module.exports = mongoose.model('data', entry);