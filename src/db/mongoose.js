const mongoose = require('mongoose')
const connectionUrl = 'mongodb://127.0.0.1:27017/mobishala'

//Making a connection and connecting to our database
mongoose.connect(connectionUrl,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false,
	useUnifiedTopology: true
})