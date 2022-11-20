const author = require("../model/authorModel")
const jwt =require('jsonwebtoken')
const authorModel = require("../model/authorModel")
const emailMatch = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/  //regedx for the checking the email id
const matchPass = /^(?=.*[0-9])(?=.*[!@#$%^&#])[a-zA-Z0-9!@#$%^&*]{8,18}$/     //regrex for checking the password
const checkName= /^[a-zA-Z]+$/

const createauthor = async function(req,res){
  try{
    let data = req.body
    let { firstName,lastName,title,email,password} = data
    if(Object.keys(data).length ===0)
    return res.status(400).send({status:false,msg:"Please use data to create author"})

    if(!firstName || firstName =="")
    return res.status(400).send({status:false,msg:"Please enter first name"})
    if(!checkName.test(firstName))
    return res.status(400).send({status:false,msg:"Please use Valid First Name"})

    if(!lastName || lastName =="")
    return res.status(400).send({status:false,msg:"Please enter Last name"})
    if(!checkName.test(lastName))
    return res.status(400).send({status:false,msg:"Please use Last Name"})

    if(!title || title =="")
    return res.status(400).send({status:false,msg:"Please use Title"})

    if(!email)
    return res.status(400).send({status:false,msg:"Please Enter Email"})
    let validEmail = await authorModel.findOne({email:email})
    if(validEmail)
    return res.status(400).send("This email Id is already registered")
    if(!email.match(emailMatch))
    return res.status(400).send({status:false,msg:"Please use valid Email-ID"})

    if(!password)
    return res.status(404).send({status:false,msg:"Please use password"})
    if(password.length<8)
    return res.status(400).send({status:false,msg:"please use more then eight characters"})
    if(!matchPass.test(password))
    return res.status(400).send({status:false,msg:"Please use special character to make strong password"})

   let saveData = await author.create(data)
  res.status(200).send({status:true,msg:saveData})
  }
  catch(err){
    return res.status(500).send({status: false,msg:err})
  }
 

}

//authentication
const login = async function (req, res) { 
  try{
    let userName =req.body.email;
    if (!userName || userName == "")
            return res.status(400).send({ status: false, msg: "Please enter Email-ID" })
  
    let password =req.body.password;
    if (!password || password == "")
    return res.status(400).send({ status: false, msg: "Please enter password" })

  
    let user= await authorModel.findOne({
      email:userName,
      password:password
    });
  
    if (!user) return res.send ({status:false,msg:"Email-ID or password is incorrect"})
  
    let usertoken = jwt.sign(
  
      {user: user._id.toString()   //to take the plain text while using toString in jwt
  
      },
      "project1"
    );
    
   res.status(200).send({status:true,msg:usertoken});

    if(!usertoken)
    {
      return res.status(400).send({status:false,msg:"token is incorect"})
    }
  
    
  } catch(error){
    return res.status(401).send({status:false,message:error.message})
  }
}


module.exports.createauthor=createauthor
module.exports.login=login