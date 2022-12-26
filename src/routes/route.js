const { Router } = require("express")
const express = require("express")
const router = express.Router();
const newAuthor = require("../controller/authorController")
const newBlogs = require("../controller/blogsController")
const middleware = require("../middleware/auth")

//router is the function of express lib

router.post("/authors",newAuthor.createauthor)
router.post("/login",newAuthor.login)

router.post("/createBlogs",middleware.authentication,newBlogs.createNewBlogs)
router.get("/getBlogs",middleware.authentication,newBlogs.getblogs)
router.put("/updateBlog/:blogId",middleware.authentication,middleware.authorization,newBlogs.updatedblog)

router.delete("/deleteBlog/:blogId",middleware.authentication,middleware.authorization,newBlogs.deleteBlog)
router.delete("/deleteByQuery",middleware.authentication,middleware.authorization,newBlogs.deleteByQuery)

module.exports=router



//collection of function is module
//collection of module is package
//collection pf package is library
//collection of library is framework
//collection of framework is npm