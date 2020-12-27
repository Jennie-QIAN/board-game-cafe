const express = require('express');
const router  = express.Router();

const { findAllGames } = require('../queries/games.query');
const User = require('../models/User.model.js');

router.get('/search-game', async (req, res) => {
    const games = await findAllGames(req.query.gameName);
    res.json(games);
});

router.post('/like-game', async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, { $push: {favoriteGames: req.body.gameId}});
    res.send("game added to your favorite list");
});

router.patch('/unlike-game', async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, { $pull: {favoriteGames: req.body.gameId}});
    res.send("game removed from your favorite list");
});

module.exports = router;