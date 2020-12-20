const express = require('express');
const router  = express.Router();

const Play = require('../models/Play.model.js');

const ensureAuthenticated = require('../utils/middleware.js');

const { findPlaysByLocation, findPlayById } = require('../queries/plays.query');

router.get('/plays', async (req, res, next) => {
    const {location} = req.query;
    const availableLocations = ["Paris", "Lyon", "Nice", "Hyères", "Corse"];
    const nonSelectedLocations = availableLocations.filter((loc => loc !== location));

    const plays = await findPlaysByLocation(location);

    res.render('plays/plays', {
        location,
        nonSelectedLocations,
        isLoggedIn: req.isAuthenticated(),
        plays,
    });
});

router.get('/plays/new', ensureAuthenticated, (req, res, next) => {
    res.render('plays/new', {
        isLoggedIn: req.isAuthenticated()
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
        //gamesForPlay,
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
        minPlayer,
        maxPlayer
    })
        .then(newPlay => res.redirect(`/plays/${newPlay.id}`))
        .catch(err => console.log(err));

});

router.get('/plays/:id', async (req, res, next) => {
    const playId = req.params.id;
    const play = await findPlayById(playId);

    res.render('plays/show', {
        play,
        isLoggedIn: req.isAuthenticated(),
    });
});


module.exports = router;