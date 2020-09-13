
var mongoose = require("mongoose");
//--SCHEMA SETUP
var camp_shema = new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		//ref is model Comment 
		ref:"Comment"
	}] 
});

var Camp_model = mongoose.model('Camp_model', camp_shema);

module.exports = Camp_model;