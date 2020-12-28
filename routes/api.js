const express = require('express');
const router  = express.Router();

const { findAllGames } = require('../queries/games.query');
const User = require('../models/User.model.js');
const Play = require('../models/Play.model.js');

router.get('/search-game', async (req, res) => {
    const games = await findAllGames(req.query.gameName);
    res.json(games);
});

router.post('/like-game', async (req, res) => {
    if (!req.isAuthenticated()) {
        return;
    }
    await User.findByIdAndUpdate(req.user.id, { $push: {favoriteGames: req.body.gameId}});
    res.send("game added to your favorite list");
});

router.patch('/unlike-game', async (req, res) => {
    if (!req.isAuthenticated()) {
        return;
    }
    await User.findByIdAndUpdate(req.user.id, { $pull: {favoriteGames: req.body.gameId}});
    res.send("game removed from your favorite list");
});

router.post('/join-play', async (req, res) => {
    if (!req.isAuthenticated()) {
        return;
    }

    const userId = req.user.id;
    const playId = req.body.playId;
    const [ user ] = await Promise.all([
        User.findByIdAndUpdate(userId, { $push: {joinedPlays: playId}}),
        Play.findByIdAndUpdate(playId, { $push: {players: userId}})
    ]);
    
    res.json(user);
});

router.patch('/unjoin-play', async (req, res) => {
    if (!req.isAuthenticated()) {
        return;
    }

    const userId = req.user.id;
    const playId = req.body.playId;
    const [ user ] = await Promise.all([
        User.findByIdAndUpdate(userId, { $pull: {joinedPlays: playId}}),
        Play.findByIdAndUpdate(playId, { $pull: {players: userId}})
    ]);
   
    res.json(user);
});

module.exports = router;