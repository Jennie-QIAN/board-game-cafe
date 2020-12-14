const express = require('express');
const router  = express.Router();
const url = require('url');

// Using req.query to pass variable to the redirected route

// router.get('/plays', (req, res, next) => {
//     const {game, location} = req.query;
//     const availableLocations = ["Paris", "Lyon", "Nice", "Hyères", "Corse"];
//     const nonSelectedLocations = availableLocations.filter((loc => loc !== location));
//     res.render('plays/plays', { game, location, nonSelectedLocations, isLoggedIn: req.isAuthenticated() });
// });

router.get('/plays', (req, res, next) => {
    if (!req.session.search) {
        res.render('plays/plays');
        return;
    }
    const {game, location} = req.session.search;
    const availableLocations = ["Paris", "Lyon", "Nice", "Hyères", "Corse"];
    const nonSelectedLocations = availableLocations.filter((loc => loc !== location));
    res.render('plays/plays', { game, location, nonSelectedLocations, isLoggedIn: req.isAuthenticated() });
    //req.session.search = null;
});

module.exports = router;