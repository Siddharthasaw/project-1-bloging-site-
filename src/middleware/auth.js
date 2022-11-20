const { query } = require("express");
const jwt = require("jsonwebtoken");
const BlogsModel = require("../model/BlogsModel");

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        console.log(token)

        if (!token) return res.status(401).send({ status: false, msg: "Token must be present" });

        let decodedToken = jwt.verify(token, "project1");
        console.log(decodedToken)

        req.decodedToken = decodedToken
        if (!decodedToken) return res.status(400).send({ status: false, msg: "Token is invalid" });
        else {

            next()
        }
    }

    catch (err) {
        res.status(500).send({ status:false,msg: err.message })
    }
}




const  authorization = async function (req, res, next) {
    try {
        
        blogId=req.params.blogId
        console.log(req.params)
        
        let data=await BlogsModel.findById(blogId)
        if (!data)
        return res.status(404).send({msg:"Data not found "})
       let autherd= data.authorId.toString()
       console.log(autherd)
    

        if (req.decodedToken.user !== autherd)
         return res.status(403).send({ status: false, msg: "you do not have authorization to this " });
        else {
            next()
        }
    }
    catch (err) {
        res.status(500).send({ status:false,msg: err.message })
    }
}

module.exports ={authentication,authorization}