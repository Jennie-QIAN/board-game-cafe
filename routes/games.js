const express = require('express');
const router  = express.Router();

const { findAllGames } = require('../queries/games.query');
const Game = require('../models/Game.model.js');

router.get('/games', async (req, res, next) => {

    const { game, category, mechanic, minPlayer, maxPlayer } = req.query;

    const [ categories, mechanics, games  ] = await Promise.all([
        Game.distinct('category'),
        Game.distinct('mechanic'),
        findAllGames(game, category, mechanic, minPlayer, maxPlayer)
      ]);

    res.render('games/games', {
        game,
        category,
        mechanic,
        minPlayer,
        maxPlayer,
        isLoggedIn: req.isAuthenticated(),
        games,
        categories,
        mechanics
    });
});

module.exports = router;