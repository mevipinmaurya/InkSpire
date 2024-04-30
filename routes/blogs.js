const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { blogSchema } = require("../schema.js");
const Blog = require("../models/blogs.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");

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
    let allBlogs = await Blog.find().populate("author");
    res.render("blogs/index.ejs", { allBlogs });
}))

// index food route
router.get("/food", wrapAsync(async(req, res)=>{
    let allBlogs = await Blog.find({category : "Food"}).populate("author");
    res.render("blogs/index.ejs", { allBlogs });
}))

// index exercise route
router.get("/exercise", wrapAsync(async(req, res)=>{
    let allBlogs = await Blog.find({category : "Exercise"}).populate("author");
    res.render("blogs/index.ejs", { allBlogs });
}))

// index travel route
router.get("/travel", wrapAsync(async(req, res)=>{
    let allBlogs = await Blog.find({category : "Travel"}).populate("author");
    res.render("blogs/index.ejs", { allBlogs });
}))

// index mind therapy route
router.get("/mindTherapy", wrapAsync(async(req, res)=>{
    let allBlogs = await Blog.find({category : "Mind Therapy"}).populate("author");
    res.render("blogs/index.ejs", { allBlogs });
}))

// index nature route
router.get("/nature", wrapAsync(async(req, res)=>{
    let allBlogs = await Blog.find({category : "Nature"}).populate("author");
    res.render("blogs/index.ejs", { allBlogs });
}))
// index health route
router.get("/health", wrapAsync(async(req, res)=>{
    let allBlogs = await Blog.find({category : "Health"}).populate("author");
    res.render("blogs/index.ejs", { allBlogs });
}))



// GET new route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("blogs/new.ejs");
})

// POST new route
router.post("/", validateBlogs, wrapAsync(async (req, res) => {
    const newBlog = new Blog(req.body.blog);
    newBlog.author = req.user._id;

    req.flash("success", "New blog posted");
    await newBlog.save();
    res.redirect("/blogs");
}))

// Edit route
router.get("/:id/edit", isLoggedIn, isAuthor, validateBlogs, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let blogs = await Blog.findById(id);
    if (!blogs) {
        req.flash("error", "Post does not exist !!!");
        res.redirect("/blogs");
    }
    res.render("blogs/edit.ejs", { blogs });
}))

// Update route
router.put("/:id", isLoggedIn, isAuthor, validateBlogs, wrapAsync(async (req, res) => {
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
router.delete("/:id", isLoggedIn, isAuthor, validateBlogs, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedBlog = await Blog.findByIdAndDelete(id);
    console.log(deletedBlog);
    req.flash("success", "Blog deleted");
    res.redirect("/blogs");
}))

// show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let blogs = await Blog.findById(id).populate({path : "reviews", populate : {path : "createdBy"}}).populate("author");
    // console.log(blogs);
    if (!blogs) {
        req.flash("error", "Post does not exist !!!");
        res.redirect("/blogs");
    }
    res.render("blogs/show.ejs", { blogs });
}))

module.exports = router;