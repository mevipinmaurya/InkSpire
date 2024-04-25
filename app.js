const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Blog = require("./models/blogs.js");
const path = require("path");
const methodOverride = require('method-override')
const engine = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));



main().then(() => {
    console.log("Connection Successfull");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/inkspire');
}



// index route
app.get("/blogs", async (req, res) => {
    let allBlogs = await Blog.find();
    res.render("blogs/index.ejs", { allBlogs });
})

// GET new route
app.get("/blogs/new", (req, res) => {
    res.render("blogs/new.ejs");
})

// POST new route
app.post("/blogs", async (req, res) => {
    let { title: newTitle, content: newContent, image: newImage } = req.body;
    const newBlog = new Blog({
        title: newTitle,
        content: newContent,
        image : newImage
    })

    await newBlog.save();
    res.redirect("/blogs");
})

// Edit route
app.get("/blogs/:id/edit", async (req, res) => {
    let { id } = req.params;
    let blogs = await Blog.findById(id);
    res.render("blogs/edit.ejs", { blogs });
})

// Update route
app.put("/blogs/:id", async (req, res) => {
    let { id } = req.params;
    let { title: newTitle, content: newContent, image : newImg } = req.body;
    await Blog.findByIdAndUpdate(id, {
        title: newTitle,
        content: newContent,
        image : newImg
    });
    res.redirect(`/blogs/${id}`);
})


// Destroy route
app.delete("/blogs/:id", async (req, res) => {
    let { id } = req.params;
    let deletedBlog = await Blog.findByIdAndDelete(id);
    console.log(deletedBlog);
    res.redirect("/blogs");
})


// show route
app.get("/blogs/:id", async (req, res) => {
    let { id } = req.params;
    let blogs = await Blog.findById(id);
    res.render("blogs/show.ejs", { blogs });
})


app.get("/", (req, res) => {
    res.send("I am root");
})

app.listen("8080", () => {
    console.log("Listening on port 8080");
})