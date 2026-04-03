const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./joiSchema");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You are not logged in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have access for changes!");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.validateList = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let newErr = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, newErr);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let newErr = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, newErr);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next) =>{
    let { id, rid } = req.params;
        let review = await Review.findById(rid);
        if(!review.author._id.equals(res.locals.currUser._id)) {
            req.flash("error", "you do not have permission to delete!");
            return res.redirect(`/listing/${id}`);
        }
        next();
}