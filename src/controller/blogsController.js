const newBlogs = require("../model/BlogsModel");
const author = require("../model/authorModel");
const { isValidObjectId } = require("mongoose");

const createNewBlogs = async function (req, res) {
  try {
    let data = req.body;
    let { title, body, tags, category, subCategory, authorId } = data;
    if (Object.keys(data).length === 0)
      return res.status(400).send({ status: false, msg: "Please use data to create Blog" });

    if (!title || title == "")
      return res.status(400).send({ status: false, msg: "Please enter Title" });

    if (!body || body == "")
      return res.status(400).send({ status: false, msg: "Please enter Body" });

    if (!tags || tags == "")
      return res.status(400).send({ status: false, msg: "Please enter Tags" });

    if (!category || category == "")
      return res.status(400).send({ status: false, msg: "Please enter category" });

    if (!subCategory || subCategory == "")
      return res.status(400).send({ status: false, msg: "Please enter subCategory" });

    if (!authorId || authorId == "")
      return res.status(400).send({ status: false, msg: "Please enter authorId" });

    let checkAuthorId = await author.findById(authorId);
    if (!checkAuthorId) {
      return res.status(403).send({ status: false, msg: "Please enter a valid authorId" });
    }

    let blogger = await newBlogs.create(data);
    return res.status(201).send({ status: true, msg: blogger });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const getBlogs = async function (req, res) {
  try {
    let data = req.query;
    data.isDeleted = false;
    data.isPublished = true;
    let Id = req.query.authorId;

    if (Id && !isValidObjectId(Id)) {
      return res.status(400).send({ status: false, msg: "author id is not valid" });
    }

    let result = await newBlogs.find(data).populate('authorId');
    if (result.length < 1) {
      res.status(404).send({ status: false, msg: "No blog found" });
    } else {
      res.status(200).send({ status: true, msg: result });
    }
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    let getId = req.params.blogId;
    let data = req.body;

    if (Object.keys(data).length === 0)
      return res.status(400).send({ status: false, msg: "Please use data to update blog" });

    let { tags, subCategory, title, body } = data;
    if (!tags || tags == "")
      return res.status(400).send({ status: false, msg: "Please use valid tags" });
    if (!subCategory || subCategory == "")
      return res.status(400).send({ status: false, msg: "Please use valid subCategory" });
    if (!title || title == "")
      return res.status(400).send({ status: false, msg: "Please use valid title" });
    if (!body || body == "")
      return res.status(400).send({ status: false, msg: "Please use valid body" });

    let updateId = await newBlogs.findOne({ _id: getId });
    if (!updateId) {
      return res.status(403).send({ status: false, msg: "Please enter valid blog Id" });
    }
    if (updateId.isDeleted) {
      return res.status(400).send({ status: false, msg: "Can't update, it's deleted" });
    }

    let updatedBlog = await newBlogs.findByIdAndUpdate(
      { _id: getId },
      {
        $push: { tags: data.tags, subCategory: data.subCategory },
        category: data.category,
        title: data.title,
        body: data.body,
        isPublished: data.isPublished,
        publishAt: Date.now()
      },
      { new: true }
    );

    return res.status(200).send({ status: true, msg: updatedBlog });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteBlog = async function (req, res) {
  try {
    let id = req.params.blogId;

    if (!id) {
      return res.status(400).send({ status: false, msg: "ID not found" });
    }

    let blogId = await newBlogs.findById({ _id: id });
    if (!blogId) {
      return res.status(403).send({ status: false, msg: "Not a valid blog id" });
    }
    if (blogId.isDeleted) {
      return res.status(404).send({ status: false, msg: "Blog already deleted" });
    }

    let deletes = await newBlogs.findOneAndUpdate(
      { _id: id },
      { $set: { isDeleted: true }, deletedAt: new Date(), publishAt: new Date() },
      { new: true }
    );
    return res.status(200).send({ status: true, msg: deletes });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const deleteByQuery = async function (req, res) {
  try {
    let data = req.query;
    if (!data) {
      return res.status(400).send({ status: false, msg: "please write query" });
    }
    let decodedToken = req.decodedToken;
    data.authorId = decodedToken.user;

    let blogs = await newBlogs.find(data);
    if (!blogs || blogs.length === 0) {
      return res.status(404).send({ status: false, msg: "no blog found" });
    }

    let deleteBlogs = await newBlogs.updateMany(
      {
        $or: [
          { authorId: data.authorId },
          { category: data.category },
          { tags: data.tag },
          { title: data.title },
          { subcategory: data.subcategory },
          { isPublished: data.isPublished }
        ]
      },
      { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now(), publishAt: new Date() } }
    );
    res.status(200).send({ status: true, msg: deleteBlogs });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createNewBlogs = createNewBlogs;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteByQuery = deleteByQuery;


