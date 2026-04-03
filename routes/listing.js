if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}
const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { isLoggedIn, isOwner, validateList } = require("../middleware");
const listingController = require("../controller/listing");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
    .route("/search")
    .get(wrapAsync(listingController.searchListing));

router
    .route("/")
    //allListing route
    .get(wrapAsync(listingController.indexlisting))
    //Create route
    .post(isLoggedIn, validateList, upload.single("listing[image]"), wrapAsync(listingController.createListing));

router
    .route("/new")
    //add route
    .get(isLoggedIn, listingController.addListing);

router
    .route("/:id")
    //see detail route
    .get(wrapAsync(listingController.showListing))
    //update route
    // .patch(isLoggedIn, isOwner, validateList, wrapAsync(listingController.updateListing))
    .patch(upload.single("listing[image]"), listingController.updateListing)
    //delete route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//edit route
router
    .route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(listingController.editListing));

module.exports = router;