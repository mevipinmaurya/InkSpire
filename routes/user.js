const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
})

router.post("/signup", async (req, res) => {
    let { username, password, email } = req.body;
    let newUser = new User({ email, username });
    const regUser = await User.register(newUser, password);
    console.log(regUser);
    req.login(regUser, ((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Registration successfull !!!")
        res.redirect("/blogs");
    }))
})


router.get("/login", (req, res) => {
    res.render("user/login.ejs");
})

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Login Successfull !!!")
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/blogs");
    }
})

router.get("/logout", (req, res)=>{
    req.logout((err)=>{
        if(err){
        return next(err);
        }
        req.flash("success", "You are successfully Logged out");
        res.redirect("/blogs");
    })
})

module.exports = router;