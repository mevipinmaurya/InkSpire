const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override')
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const sessionOption = {
    secret: 'mysuperSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}


const blogRouter = require("./routes/blogs.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


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



app.get("/", (req, res) => {
    res.send("I am root");
})

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next()
})


// app.get("/demoUser", async (req, res)=>{
//     let newUser = new User({
//         email : "demo@gmail.com",
//         username : "demo"
//     });
//     const regUser = await User.register(newUser, "demo");
//     res.send(regUser);
// })


// Blogs router
app.use("/blogs", blogRouter);
// Review Router
app.use("/blogs/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !!!"));
})

// Error Handling
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!!!" } = err;
    res.status(statusCode).render("error.ejs", { message });
})

app.listen("8080", () => {
    console.log("Listening on port 8080");
})