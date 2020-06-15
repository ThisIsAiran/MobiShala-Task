const mongoose = require('mongoose')
const userSchema = require('./userSchema.js')

const productSchema = new mongoose.Schema({
	name:{
		type:String,
		trim:true,
		required:true,
		unique:true
	},
	price:{
		type:Number,
		trim:true,
		required:true,
	},
	rating:{
		type:Number,
		trim:true,
		required:true,
		default: 0
	},
	userCount:{
		type:Number,
		trim:true,
		required:true,
		default:0
	}
})

const  productModel = mongoose.model('productModel', productSchema)
module.exports = productModel

