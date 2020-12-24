const express = require('express');
const router  = express.Router();

const Play = require('../models/Play.model.js');

const { ensureAuthenticated } = require('../utils/middleware.js');

const { findPlaysByLocation, findPlaysByLocAndDate, findPlayById } = require('../queries/plays.query');

router.get('/plays', async (req, res, next) => {
    const {
        location,
        dateFrom,
        dateTo,
    } = req.query;

    const availableLocations = ["Paris", "Lyon", "Nice", "Hyères", "Corse"];
    const nonSelectedLocations = availableLocations.filter((loc => loc !== location));

    const plays = await findPlaysByLocAndDate(location, dateFrom, dateTo);

    //const plays = await findPlaysByLocation(location);

    res.render('plays/plays', {
        location,
        dateFrom,
        dateTo,
        nonSelectedLocations,
        isLoggedIn: req.isAuthenticated(),
        plays,
    });
});

router.get('/plays/new', ensureAuthenticated, (req, res, next) => {
    res.render('plays/new', {
        isLoggedIn: req.isAuthenticated(),
        scripts: [
            "https://unpkg.com/axios@0.21.0/dist/axios.min.js",
            "/javascripts/play-form.js"
        ],
    });
});

router.post('/plays/new', (req, res, next) => {
    const {
        datetime: dateTime,
        nameOfCommerce,
        street,
        postCode,
        city,
        moreInstruction,
        gamesForPlay,
        minPlayer,
        maxPlayer,  
    } = req.body;

    Play.create({
        organizer: req.user,
        dateTime,
        location: {
            city,
            postCode,
            nameOfCommerce,
            street,
            moreInstruction
        },
        gamesForPlay,
        minPlayer,
        maxPlayer
    })
        .then(newPlay => res.redirect(`/plays/${newPlay.id}`))
        .catch(err => console.log(err));

});

router.get('/plays/:id', async(req, res, next) => {
    const playId = req.params.id;
    const play = await findPlayById(playId);
    const isLoggedIn = req.isAuthenticated();

    const isOrganizer = isLoggedIn? (req.user.id === play.organizer.id) : false;

    res.render('plays/show', {
        play,
        isLoggedIn,
        isOrganizer,
    });
});

router.get('/plays/:id/edit', ensureAuthenticated, async(req, res, next) => {
    const playId = req.params.id;
    const play = await findPlayById(playId);
    const isLoggedIn = req.isAuthenticated();

    const isOrganizer = isLoggedIn? (req.user.id === play.organizer.id) : false;

    res.render('plays/edit', {
        play,
        isLoggedIn,
        isOrganizer,
        scripts: [
            "https://unpkg.com/axios@0.21.0/dist/axios.min.js",
            "/javascripts/play-form.js"
        ],
    });
});

router.post('/plays/:id/edit', (req, res, next) => {
    const playId = req.params.id;
    const {
        dateTime,
        nameOfCommerce,
        street,
        postCode,
        city,
        moreInstruction,
        gamesForPlay,
        minPlayer,
        maxPlayer,
    } = req.body;

    const updatedPlay = {
        dateTime,
        location: {
            nameOfCommerce,
            street,
            postCode,
            city,
            moreInstruction,
        },
        gamesForPlay,
        minPlayer,
        maxPlayer,
    };

    Play.findByIdAndUpdate(playId, updatedPlay)
        .then(() => res.redirect(`/plays/${playId}`))
        .catch(err => console.log(err));
});

router.post('/plays/:id/delete', (req, res, next) => {
    Play.findByIdAndRemove(req.params.id)
        .then(()=> res.redirect('/plays'))
        .catch(err => next(err));
});

module.exports = router;