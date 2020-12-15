const express = require('express');
const router  = express.Router();
const url = require('url');

const { findAllPlays } = require('../queries/plays.query');
const { findAllGames } = require('../queries/games.query');
const { map } = require('../app');

router.get('/plays', async (req, res, next) => {
    const {game, location} = req.query;
    const availableLocations = ["Paris", "Lyon", "Nice", "Hyères", "Corse"];
    const nonSelectedLocations = availableLocations.filter((loc => loc !== location));

    const games = await findAllGames(game);
    const gameIds = games.map(game => game._id);
    const plays = await findAllPlays(gameIds, location);

    res.render('plays/plays', { game, location, nonSelectedLocations, isLoggedIn: req.isAuthenticated(), plays });
});

//===Alternative: use session to stock and pass variable to redirected route==
// router.get('/plays', (req, res, next) => {
//     if (!req.session.search) {
//         res.render('plays/plays');
//         return;
//     }
//     const {game, location} = req.session.search;
//     const availableLocations = ["Paris", "Lyon", "Nice", "Hyères", "Corse"];
//     const nonSelectedLocations = availableLocations.filter((loc => loc !== location));
//     res.render('plays/plays', { game, location, nonSelectedLocations, isLoggedIn: req.isAuthenticated() });
// });

module.exports = router;