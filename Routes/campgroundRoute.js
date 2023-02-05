const express = require('express')
const router = express.Router();
const Campground = require('../models/campground')
const CatchError = require('../utilitis/CatchAsync');
const CatchAsync = require('../utilitis/CatchAsync')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.get('/', CatchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn, validateCampground, CatchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully Made a New Campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'review',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, CatchAsync(async (req, res) => {
    const { id } = req.params;
    // if (!req.body.campground) throw new ExpressError('Validation Failed', 400)
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true })
    req.flash('success', 'Successfully Updated The Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted The Campground!')
    res.redirect(`/campgrounds`)
}))

module.exports = router;