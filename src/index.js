 const express = require("express");
 const mongoose = require("mongoose");
 const route = require("./routes/route");
 const app = express() 

 app.use(express.json());   

 mongoose.connect("mongodb+srv://kunal0709:Singhkunal7@cluster0.u5yk4f2.mongodb.net/project1",{
     useNewUrlParser:true  
 }) 

 .then(()=> console.log("MongoDB is connected"))  
 .catch(err => console.log(err))

 

 app.use("/",route)  

 app.listen(process.env.PORT || 3000, function(){
     console.log("express app runing on port "+(process.env.PORT || 3000) )
 })




  