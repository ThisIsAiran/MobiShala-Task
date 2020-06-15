const express = require('express')
const ejs = require('ejs')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 3500
const urlencodedParser = bodyParser.urlencoded({ extended: false})
const partialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const userRouter = require('./routers/user.js')
const productRouter = require('./routers/product.js')


//Connect to Database
require('./db/mongoose.js')

app.use(express.static(publicDirectoryPath))
app.use(express.json())

//here adding two router files one for user and one for Product
app.use(userRouter)
app.use(productRouter)


app.set('view engine', 'ejs');
app.set('views',viewsPath);
	
//get request for home page
app.get('/',(req, res)=>{
	res.render('home')
})

//Listen to port 3500
app.listen(port, ()=>{
	console.log("Server is on port " + port)
})