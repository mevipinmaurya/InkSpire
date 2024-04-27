const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Blog = require("../models/blogs.js");
const Review = require("../models/review.js");
const ExpressError = require("../utils/ExpressError.js");


const validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// Review Route
router.post("/",validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let blogs = await Blog.findById(id);
    let newReview = await Review(req.body.review);
    blogs.reviews.push(newReview);
    await newReview.save();
    await blogs.save();
    req.flash("success", "New feedback added");
    res.redirect(`/blogs/${id}`);
}))

// Review Deletion route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Blog.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Feedback deleted");
    res.redirect(`/blogs/${id}`);
}))

module.exports = router;