const newBlogs = require("../model/BlogsModel")
const author = require("../model/authorModel")
const { createauthor } = require("./authorController")
const { now } = require("mongoose")
const { JsonWebTokenError } = require("jsonwebtoken")
const { isValidObjectId } = require("mongoose")

const createNewBlogs = async function (req, res) {
    try {
        let data = req.body
        let { title, body, tags, category, subCategory, authorId } = data
        if (Object.keys(data).length === 0)
            return res.status(400).send({ status: false, msg: "Please use data to create Blog" })

        if (!title || title == "")
            return res.status(400).send({ status: false, msg: "Please enter Title" })

        if (!body || body == "")
            return res.status(400).send({ status: false, msg: "Please enter Body" })

        if (!tags || tags == "")
            return res.status(400).send({ status: false, msg: "Please enter Tags" })

        if (!category || category == "")
            return res.status(400).send({ status: false, msg: "Please enter category" })

        if (!subCategory || subCategory == "")
            return res.status(400).send({ status: false, msg: "Please enter subCategory" })

        if (!authorId || authorId == "")
            return res.status(400).send({ status: false, msg: "Please enter authorId" })

        let authorID = data.authorId
        let checkAuthorId = await author.findById(authorID)
        if (!authorID) {
            return res.status(401).send({ status: false, msg: "Please put author Id" })
        }
        else if (!checkAuthorId) {
            return res.status(403).send({ status: false, msg: "Please enter a valid authorId" })
        }

        else {
            let blogger = await newBlogs.create(data)
            return res.status(201).send({ status: true, msg: blogger })
        }

    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
}


    const getblogs = async function (req, res) {
        try {
          let data = req.query
          data.isDeleted = false
          data.isPublished = true
          let Id = req.query.authorId
      
          if (!Id) {
            let result = await newBlogs.find(data).populate('authorId')
            if (result.length < 1) { res.status(404).send({ status: false, msg: "No blog found" }) }
            else { res.status(200).send({ status: true, msg: result }) }
          }
          else {
            if (!isValidObjectId(Id)) { return res.status(400).send({ status: false, msg: "author id is not valid" }) }
            let result = await newBlogs.find(data).populate('authorId')
            if (result.length == 0) { res.status(404).send({ status: false, msg: "no blog found" }) }
            else { res.status(200).send({ status: true, msg: result }) }
          }
        }
      
        catch (err) {
          res.status(500).send({ status: false, msg: err.message })
        }
      }

const updatedblog = async function (req, res) {
    try {
        let getId = req.params.blogId
        let data = req.body

        if (Object.keys(data).length === 0)
            return res.status(404).send({ status: false, msg: "Please use data to update blog" })

        let { tags, subCategory, title, body } = data
        //validation of tags
        if (!tags || tags == "")
            return res.status(400).send({ status: false, msg: "Please use valid tags" })
        //validation subcategory
        if (!subCategory || subCategory == "")
            return res.status(400).send({ status: false, msg: "Please use valid subCategory" })
        //validation of title
        if (!title || title == "")
            return res.status(400).send({ status: false, msg: "Please use valid title" })
        //validation of body
        if (!body || body == "")
            return res.status(400).send({ status: false, msg: "Please use valid body" })



        let updateId = await newBlogs.findOne({ _id: getId })
        if (updateId) {
            if (updateId.isDeleted) {
                return res.send("Can't Updated,It's is Deleted")

            }
            else {

                let updatedBlog = await newBlogs.findByIdAndUpdate(
                    { _id: getId },
                    {
                        $push: { tags: data.tags, subCategory: data.subCategory },
                        category: data.category,
                        title: data.title,
                        body: data.body,
                        isPublished: data.isPublished,
                        publishAt:Date.now() 
                    },
                    { new: true }
                )

                return res.status(200).send({ status: true, msg: updatedBlog })
            }
        }

        else {
            return res.status(403).send({ status: false, msg: "Please enter valid blog Id" })
        }

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const deleteBlog = async function (req, res) {
    try {
        let id = req.params.blogId

        if (!id) {
            return res.status(404).send({ status: false, msg: "ID not found" })
        }

        let blogId = await newBlogs.findById({ _id: id })
        if (!blogId) {
            return res.status(403).send({ status: false, msg: "Not a valid blog id" })
        }
        if (blogId.isDeleted) {
            return res.status(404).send({ status: false, msg: "Blog already deleted" })
        }
        else {
            let deletes = await newBlogs.findOneAndUpdate({ _id: id },
                { $set: { isDeleted: true }, deletedAt: new Date(), publishAt: new Date() },
                { new: true })
            console.log(deletes)
            return res.status(200).send({ status: true })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err })
    }

}

const deleteByQuery = async function (req, res) {
    try {

        let data = req.query
        if(!data)
        {
            res.status(400).send({status:false,msg:"please write query"})
        }
        let decodedToken = req.decodedToken
        data.authorId = decodedToken.user
        console.log(data)
        let blogs = await newBlogs.find(data)
        console.log(blogs)
        if (!blogs) {
            res.status(400).send({ status: false, msg: "no blog found" })
        }

        let deleteBlogs = await newBlogs.updateMany({
            $or: [{ authorId: data.authorId },
            { category: data.category }, { tags: data.tag }, { title: data.title }, { subcategory: data.subcategory }, { isPublished: data.isPublished }]
        },
            { $set: { isDeleted: true, isPublished: false, deletedAt: Date.now(), publishAt: new Date() } })
        res.status(200).send({ status: true, msg: deleteBlogs })


    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err})
    }
}





module.exports.createNewBlogs = createNewBlogs
module.exports.getblogs = getblogs
module.exports.updatedblog = updatedblog
module.exports.deleteBlog = deleteBlog
module.exports.deleteByQuery = deleteByQuery
