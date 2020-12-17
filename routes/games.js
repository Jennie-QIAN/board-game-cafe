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

router.get('/games/new', (req, res, next) => {
    res.render('games/new');
});

router.post('/games/new', (req, res, next) => {
    Game.create(req.body)
        .then(newGame => {
            const id = newGame._id;
            res.redirect(`/games/${id}`);
        })
        .catch(err => {
            console.log(err);
            res.redirect('/games/new');
        });   
});

router.get('/games/:id', (req, res, next) => {
    Game.findById(req.params.id)
        .then(game => res.render('games/show', game))
        .catch(err => next(err));
})

module.exports = router;