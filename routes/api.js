const express = require('express');
const router  = express.Router();

const { findAllGames } = require('../queries/games.query');

router.get('/search-game', async (req, res) => {
    const games = await findAllGames(req.query.gameName);
    res.json(games);
});


module.exports = router;