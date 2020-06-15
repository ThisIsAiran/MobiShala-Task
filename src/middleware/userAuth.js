const jwt = require('jsonwebtoken')
const userSchema = require('../models/userSchema.js')
const productSchema = require('../models/productSchema.js')

//middle ware function for authenticating and adding tokens and userdata into request object
const auth = async (req, res, next)=>{
	try{
		const token = req.params.token
		const decode = jwt.verify(token, 'Mobishala')
		const userData = await userSchema.findOne({_id:decode._id, 'tokens.token':token})
		if(!userData)	throw new Error("Sorry you don't have permissions to acces this Url")
		const productList = await productSchema.find()
		req.token = token;
		req.userData = userData;
		req.productList = productList;
		next()
	}
	catch(e)
	{
		res.send(e.message)
	}
}

module.exports = auth