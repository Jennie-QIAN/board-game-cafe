const express = require('express');
const router  = express.Router();

const Play = require('../models/Play.model.js');

const { ensureAuthenticated } = require('../utils/middleware.js');

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
    console.log(dateTime);
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

router.get('/plays/:id/edit', async(req, res, next) => {
    const playId = req.params.id;
    const play = await findPlayById(playId);
    if (req.user.id !== play.organizer.id) {
        return res.send("You are not the owner of this play");
    }
    console.log(play.dateTime.toUTCString());
    res.render('plays/edit', {
        play,
        isLoggedIn: req.isAuthenticated(),
    });
});

router.post('/plays/:id/delete', (req, res, next) => {
    Celebrity.findByIdAndRemove(req.params.id)
        .then(()=> res.redirect('/celebrities'))
        .catch(err => next(err));
});

module.exports = router;