const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Blog = require("./models/blogs.js");
const path = require("path");
const methodOverride = require('method-override')
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { blogSchema } = require("./schema.js");
const Review = require("./models/review.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));



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


main().then(() => {
    console.log("Connection Successfull");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/inkspire');
}



// index route
app.get("/blogs", wrapAsync(async (req, res) => {
    let allBlogs = await Blog.find();
    res.render("blogs/index.ejs", { allBlogs });
}))

// GET new route
app.get("/blogs/new", (req, res) => {
    res.render("blogs/new.ejs");
})

// POST new route
app.post("/blogs", validateBlogs, wrapAsync(async (req, res) => {
    const newBlog = new Blog(req.body.blog);

    await newBlog.save();
    res.redirect("/blogs");
}))

// Edit route
app.get("/blogs/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let blogs = await Blog.findById(id);
    res.render("blogs/edit.ejs", { blogs });
}))

// Update route
app.put("/blogs/:id", validateBlogs, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { title: newTitle, content: newContent, image: newImg } = req.body.blog;
    await Blog.findByIdAndUpdate(id, {
        title: newTitle,
        content: newContent,
        image: newImg
    });
    res.redirect(`/blogs/${id}`);
}))


// Destroy route
app.delete("/blogs/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedBlog = await Blog.findByIdAndDelete(id);
    console.log(deletedBlog);
    res.redirect("/blogs");
}))


// Review Route
app.post("/blogs/:id/reviews", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let blogs = await Blog.findById(id);
    let newReview = await Review(req.body.review);
    blogs.reviews.push(newReview);
    await newReview.save();
    await blogs.save();
    res.redirect(`/blogs/${id}`);
}))

// Review Deletion route
app.delete("/blogs/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Blog.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/blogs/${id}`);
}))


// show route
app.get("/blogs/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let blogs = await Blog.findById(id).populate("reviews");
    res.render("blogs/show.ejs", { blogs });
}))


app.get("/", (req, res) => {
    res.send("I am root");
})



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !!!"));
})

// Error Handling
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!!" } = err;
    // res.send("Something wend wrong");
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { message });
})

app.listen("8080", () => {
    console.log("Listening on port 8080");
})