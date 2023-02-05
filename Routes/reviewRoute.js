const express = require('express')
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Review = require('../models/review')

const Campground = require('../models/campground')
const CatchError = require('../utilitis/CatchAsync');
const ExpressError = require('../utilitis/ExpressError')
const CatchAsync = require('../utilitis/CatchAsync')

router.post('/', isLoggedIn, validateReview, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.review.push(review);
    //review.save() comes first
    console.log(campground)
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully Posted your Review!')
    res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, CatchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    const review = await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Your Review is Deleted!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;