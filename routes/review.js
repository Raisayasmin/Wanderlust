const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")
const {reviewSchema} = require("../schema.js");
const reviewController = require("../controllers/reviews.js");



//post review route
router.post("/",isLoggedIn ,validateReview, wrapAsync(reviewController.createReview));

//delete Review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;