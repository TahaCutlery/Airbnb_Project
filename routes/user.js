const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/user");
const router = express.Router();

router.route("/signup")
    .get(userController.signupForm)
    .post(wrapAsync(userController.signupUser));

router.route("/login").get(userController.loginForm)
    .post(saveRedirectUrl,
        passport.authenticate(
            "local",
            {
                failureRedirect: "/login",
                failureFlash: true
            }),
        userController.loginUser
    );

router.route("/logout")
    .get(userController.logoutUser);

module.exports = router;