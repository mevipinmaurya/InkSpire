const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
})

router.post("/signup", async (req, res) => {
    let { username, password, email } = req.body;
    let newUser = new User({ email, username });
    const regUser = await User.register(newUser, password);
    console.log(regUser);
    req.flash("success", "Registration successfull !!!")
    res.redirect("/blogs");
})


router.get("/login", (req, res) => {
    res.render("user/login.ejs");
})

router.post("/login", passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Login Successfull !!!")
    res.redirect("/blogs");
})

module.exports = router;