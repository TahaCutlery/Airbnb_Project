const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = await Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listing/${req.params.id}`);
};

module.exports.deleteReview = async (req, res, next) => {
    let { id, rid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: rid } });
    await Review.findByIdAndDelete(rid);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listing/${id}`);
};