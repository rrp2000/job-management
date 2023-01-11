const express = require('express')
const mongoose = require('mongoose')
const env = require("dotenv").config()
const router = require("./routes/route")

const app = express()
app.use(express.json())
app.use("/",router)



mongoose.set('strictQuery', false)
mongoose.connect("mongodb+srv://spacespider:admin@cluster0.0ps1ymn.mongodb.net/xShipments?retryWrites=true&w=majority", { useNewUrlParser: true})
.then(() => {
    console.log('Connected to mongodb')
    app.listen(process.env.PORT||3000,()=>{
        console.log("Express running on port",process.env.PORT||3000)
    })
})
.catch((err)=>{
    console.log(err)
})
