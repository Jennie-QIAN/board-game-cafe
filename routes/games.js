const express = require('express');
const router  = express.Router();
const url = require('url');


// router.get('/games', (req, res, next) => {
//     if (!req.session.search) {
//         res.render('games/games');
//         return;
//     }
//     const { game } = req.session.search;

//     res.render('games/games', { game, isLoggedIn: req.isAuthenticated() });
// });

router.get('/games', (req, res, next) => {
    const {game} = req.query;
    
    res.render('games/games', { game, isLoggedIn: req.isAuthenticated() });
});

module.exports = router;