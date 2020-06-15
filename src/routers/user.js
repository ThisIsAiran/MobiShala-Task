const express = require('express')
const bodyParser = require('body-parser')
const router = new express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: false})
const userSchema = require('../models/userSchema.js')
const productSchema = require('../models/productSchema.js')
const auth = require('../middleware/userAuth.js')
const bcrypt = require('bcryptjs')


//get request to render login Page
router.get('/user/logIn', (req, res)=>{
	res.render('userLogin')
})

//get request to render signup Page
router.get('/user/signUp',(req,res)=>{
	res.render('userSignUp')
})

//post request to add User data and generate tokens for Auth
router.post('/user/signUp', urlencodedParser, async(req, res)=>{
	const userData = new userSchema(req.body)
	try{
		const username = req.body.username
		const nameFound = await userSchema.findOne({username})
		if(nameFound)
			throw new Error("UserName is already Used")

		const token = await userData.generateAuthToken()
		res.redirect('/user/productlist/' + token)
	}
	catch(e){
		res.status(400).send(e.message)
	}
})

//post request for login and redirect to Product List
router.post('/user/logIn', urlencodedParser, async (req, res)=>{
	try{
		
		const username = req.body.username
		const userData = await userSchema.findOne({username})
		if(!userData)
			throw new Error("User Name is not Valid")
		const isMatch = await bcrypt.compare(req.body.password, userData.password)
		if(!isMatch)
			throw new Error("Unable to login your password is incorrect")
		const token = await userData.generateAuthToken()
		res.redirect('/user/productlist/' + token)
	}
	catch(e)
	{
		res.status(400).send(e.message)
	}
})

//get request for showing all products
router.get('/user/productlist/:token', urlencodedParser, auth, async(req, res)=>{
	try{
		const userAndProduct = {
			userData:req.userData,
			productList:req.productList,
			token:req.token,
			popup:req.params.popup
		}
		res.render('productList',{userAndProduct:userAndProduct})
	}
	catch(e)
	{
		res.send(e.message)
	}
})

// post request for saving useres rating in Database
router.post('/user/rateProduct/:token', urlencodedParser, auth, async(req, res)=>{
	try{
		let userData = req.userData
		let findId = userData.ratedProducts.find((element)=> element == req.body.id)
		// Id not found in ratedProducts array then add it and update rating of the product
		if(!findId)
		{
			//checking whether their is any product of the given product id
			let productDetail = await productSchema.findOne({_id:req.body.id})

			//calculating the Average rating after one more User rated the Product
			productDetail.rating = (productDetail.rating*productDetail.userCount + parseFloat(req.body.rating))/(productDetail.userCount+1)
			productDetail.userCount = productDetail.userCount + 1;
			
			//saving updates in db
			await productDetail.save()
			//adding the id of products who has given rating
			userData.ratedProducts = userData.ratedProducts.concat({_id:req.body.id})

			//saving updates in db
			await userData.save()

			//agin redirecting to the productlist url
			res.redirect('/user/productlist/' + req.token )
		} 
		//else send a message already rated
		else
		{
			res.send("Already Rated Product")
		}
	}
	catch(e)
	{
		res.status(404).send("Id is Invalid")
	}
})

router.get('/user/logout/:token', urlencodedParser, auth, async(req, res)=>{
	try{
			req.userData.tokens = req.userData.tokens.filter((token)=>{
				return token.token!=req.token
			})
			await req.userData.save()
			res.redirect('/')
	}
	catch(e)
	{
		res.status(500).send(e.message)
	}
})

module.exports = router

