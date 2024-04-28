const Blog = require("./models/blogs.js");


module.exports.isLoggedIn = ((req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
})

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isAuthor = async (req, res, next)=>{
    let { id } = req.params;
    let blogs = await Blog.findById(id);
    if(!blogs.author.equals(res.locals.currUser._id)){
        req.flash("error", "Unauthorised Access !!!");
        return res.redirect(`/blogs/${id}`);
    }
    next();
}