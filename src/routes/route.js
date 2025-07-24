const express = require("express");
const router = express.Router();
const authorController = require("../controller/authorController");
const blogsController = require("../controller/blogsController");
const middleware = require("../middleware/auth");

// Author routes
router.post("/authors", authorController.createAuthor);
router.post("/login", authorController.login);

// Blog routes
router.post("/createBlogs", middleware.authentication, blogsController.createNewBlogs);
router.get("/getBlogs", middleware.authentication, blogsController.getBlogs);
router.put("/updateBlog/:blogId", middleware.authentication, middleware.authorization, blogsController.updateBlog);

router.delete("/deleteBlog/:blogId", middleware.authentication, middleware.authorization, blogsController.deleteBlog);
router.delete("/deleteByQuery", middleware.authentication, middleware.authorization, blogsController.deleteByQuery);

module.exports = router;