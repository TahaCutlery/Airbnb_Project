const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

module.exports.indexlisting = async (req, res) => {
    let data = await Listing.find({});
    res.render("listing/index.ejs", { data, title: "All Hotels List" });
};

module.exports.addListing = (req, res) => {
    try {
        res.render("listing/new.ejs", { title: "Create a new hotel list" });
    } catch (error) {
        let { status, message } = error;
        next(new ExpressError(status, message));
    }
};

module.exports.createListing = async (req, res) => {
    let data = await Listing(req.body.listing);
    let geores = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${data.location}&limit=1&appid=${process.env.WEATHER_API}`);
    let geodata = await geores.json();
    let { path, filename } = req.file;
    data.owner = req.user._id;
    data.image = { url: path, filename };
    data.geometry.coordinates = [geodata[0].lon, geodata[0].lat];
    await data.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate({ path: "review", populate: { path: "author" } }).populate("owner");
    if (!data) {
        req.flash("error", "You are trying to access that listing is does not exit!");
        res.redirect("/listing");
    } else {
        res.render("listing/show.ejs", { data, title: "See Hotel details", API: process.env.MAP_API_KEY });
    }
};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "You are trying to access that listing is does not exit!");
        res.redirect("/listing");
    } else {
        res.render("listing/edit.ejs", { data, title: "Edit your hotel details" });
    }
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    let geores = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${listing.location}&limit=1&appid=${process.env.WEATHER_API}`);
    let geodata = await geores.json();
    listing.geometry.coordinates = [geodata[0].lon, geodata[0].lat];
    if (typeof req.file !== "undefined") {
        listing.image = { url: req.file.path, filename: req.file.filename };
    }
    await Listing.findByIdAndUpdate(id, { ...listing }, { runValidators: true });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect(`/listing`);
};

module.exports.searchListing = async (req, res) => {
    let { city } = req.query;
    let data = await Listing.find({ location: city });
    res.render("listing/index.ejs", { data, title: `All Hotels List in ${city}` });
};