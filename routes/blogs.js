const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { blogSchema } = require("../schema.js");
const Blog = require("../models/blogs.js");
const ExpressError = require("../utils/ExpressError.js");

// Validate Schema
const validateBlogs = (req, res, next) => {
    let { err } = blogSchema.validate(req.body);
    if (err) {
        let errMsg = err.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// index route
router.get("/", wrapAsync(async (req, res) => {
    let allBlogs = await Blog.find();
    res.render("blogs/index.ejs", { allBlogs });
}))

// GET new route
router.get("/new", (req, res) => {
    res.render("blogs/new.ejs");
})

// POST new route
router.post("/", validateBlogs, wrapAsync(async (req, res) => {
    const newBlog = new Blog(req.body.blog);

    req.flash("success", "New blog posted");
    await newBlog.save();
    res.redirect("/blogs");
}))

// Edit route
router.get("/:id/edit", validateBlogs, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let blogs = await Blog.findById(id);
    if(!blogs){
        req.flash("error", "Post does not exist !!!");
        res.redirect("/blogs");
    }
    res.render("blogs/edit.ejs", { blogs });
}))

// Update route
router.put("/:id", validateBlogs, validateBlogs, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title: newTitle, content: newContent, image: newImg } = req.body.blog;
    await Blog.findByIdAndUpdate(id, {
        title: newTitle,
        content: newContent,
        image: newImg
    });
    req.flash("success", "Blog updated");
    res.redirect(`/blogs/${id}`);
}))


// Destroy route
router.delete("/:id", validateBlogs, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedBlog = await Blog.findByIdAndDelete(id);
    console.log(deletedBlog);
    req.flash("success", "Blog deleted");
    res.redirect("/blogs");
}))

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let blogs = await Blog.findById(id).populate("reviews");
    if(!blogs){
        req.flash("error", "Post does not exist !!!");
        res.redirect("/blogs");
    }
    res.render("blogs/show.ejs", { blogs });
}))

module.exports = router;