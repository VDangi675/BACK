const express = require("express")
const mongodb = require("mongodb")
const mongoose = require("mongoose")
const app = express();


if(process.env.NODE_ENV!=="producrion"){
    require("dotenv").config({path:"config.env"})
}

app.use(express.json())



mongoose.connect("mongodb+srv://VIKASD:VIKASD@cluster0.dvmbf51.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log("connected to database"))

const User = require("./routes/User")
const Recipe= require("./routes/recipe")
app.use(Recipe)
app.use(User)



app.listen( 5000,console.log("server is on "))