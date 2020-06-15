const express = require('express')
const bodyParser = require('body-parser')
const router = new express.Router()
const urlencodedParser = bodyParser.urlencoded({ extended: false})
const productSchema = require('../models/productSchema.js')

//get route for rendering addProduct page where we have fill form having Input fields Product Name and Product Price
router.get('/addProduct',(req, res)=>{
	res.render('addProduct')
})

//Adding Product details in database

router.post('/addProduct', urlencodedParser, async (req,res)=>{
	const productDetail = new productSchema(req.body);
	try{
			await productDetail.save();
			res.send(productDetail)
	}	
	catch(e){
		res.send(e.message)
	}
})

module.exports = router