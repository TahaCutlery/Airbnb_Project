const User = require("../models/user");

module.exports.signupForm = (req, res) => {
    res.render("user/signup.ejs", { title: 'Log In / Sign Up – Airbnb' });
};

module.exports.signupUser = async (req, res, next) => {
    try {
        let { username, password, email } = req.body;
        let newUser = new User({ username, email });
        let registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Airbnb. User register successfully!")
            res.redirect("/listing");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("user/login.ejs", { title: 'Log In – Airbnb' });
};

module.exports.loginUser = (req, res) => {
    req.flash("success", "You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listing");
    })
};