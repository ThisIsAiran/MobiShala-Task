const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
	username:{
		type:String,
		required:true,
		trim:true,
		unique:true,
		required:true
	},
	password:{
		type:String,
		required:true,
		minlength:6,
		required:true
	},
	tokens:[{
		token:{
			type: String,
			required: true
		}
	}],
	ratedProducts:[
		{
			type: String,
			trim:true
		}
	]
})

//create a token for each Instance of UserSchema
userSchema.methods.generateAuthToken = async function () {
	const userData = this
	console.log(userData)
	const token = jwt.sign({_id:userData._id.toString()}, "Mobishala")
	userData.tokens =  userData.tokens.concat({token})
	await userData.save()
	return token
}

//encrpting password
userSchema.pre('save', async function(next){
	const userData = this
	if(userData.isModified('password'))
		userData.password = await bcrypt.hash(userData.password, 8)
	next()
})


const  userModel = mongoose.model('userModel', userSchema)
module.exports = userModel


