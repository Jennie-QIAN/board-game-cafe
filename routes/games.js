const express = require('express');
const router  = express.Router();

const Comment = require('../models/Comment.model.js');
const Game = require('../models/Game.model.js');
const { findPlaysByGame } = require('../queries/plays.query');
const { findGameById, findAllGames } = require('../queries/games.query');
const { findCommentsOfGame } = require('../queries/comments.query');

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

router.get('/games/:id', async (req, res, next) => {
    const gameId = req.params.id;
    const [game, plays, comments] = await Promise.all([
        findGameById(gameId),
        findPlaysByGame(gameId),
        findCommentsOfGame(gameId)
    ]);

    res.render('games/show', {
        game,
        plays,
        comments,
        isLoggedIn: req.isAuthenticated(),
    });
});

router.post('/games/:id', (req, res) => {
    res.redirect(`/games/${req.params.id}/addcomment`);
});

router.get('/games/:id/addcomment', async (req, res) => {
    const game = await findGameById(req.params.id);
    res.render('games/comment', {
        game,
        isLoggedIn: req.isAuthenticated(),
    });
});

router.post('/games/:id/addcomment', async (req, res) => {
    const author = req.user.id;
    const game = req.params.id;
    const content = req.body.content;
    const comment = {
        author,
        game,
        content
    };

    await Comment.create(comment);
    
    res.redirect(`/games/${game}`);

});


module.exports = router;