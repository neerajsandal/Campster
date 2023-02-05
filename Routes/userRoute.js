const express = require('express');
const Router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const CatchAsync = require('../utilitis/CatchAsync');

Router.get('/register', (req, res) => {
    //under the view directory
    res.render('users/register')
})

Router.post('/register', CatchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}))

Router.get('/login', (req, res) => {
    res.render('users/login');
})

Router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), (req, res) => {
    req.flash('success', 'Welcome Back');
    const redirectedUrl = req.session.returnTo || '/campgrounds';
    // console.log(req.session.returnTo)
    delete req.session.returnTo;
    res.redirect(redirectedUrl)
})

Router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        req.flash('success', "Successfully Logged you Out!");
        res.redirect("/campgrounds");
    });
});

module.exports = Router;