require("dotenv").config()
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const MONGODB_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/airbnb";
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const { MongoStore } = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

async function main() {
    try{
        await mongoose.connect(MONGODB_URI);
        console.log("DataBase Connected!");
    } catch(err) {
        throw new ExpressError(500,"Internal server error");
    }
};
main();

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.error("error in mongo session", err);
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expired: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use("/listing", listingRouter);
app.use("/listing/:id/review", reviewRouter);
app.use("/", userRouter);

//Home route
app.get("/", (req, res) => {
    res.redirect("/listing");
})

//Error Handling
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

app.use((err, req, res, next) => {
    let { status, message } = err;
    res.render("listing/error.ejs", { status, message, title: status });
})

app.listen(port, () => {
    console.log(`server working on port: ${port}`);
})