const express = require('express');
const router  = express.Router();

const { findPlaysByLocation } = require('../queries/plays.query');
const { findAllGames, findLatestFeaturedGame } = require('../queries/games.query');
const User = require('../models/User.model.js');

router.get('/', async (req, res, next) => {
  let location;
  let favoriteGames = [];

  if (req.isAuthenticated()) {
    location = req.user.location;
    const user = await User.findById(req.user.id);
    favoriteGames = user.favoriteGames;
  }

  const [ games, plays, latestFeaturedGame ] = await Promise.all([
    findAllGames(),
    findPlaysByLocation(location),
    findLatestFeaturedGame()
  ]);
    
  res.render('index', {
    games,
    plays,
    latestFeaturedGame,
    isLoggedIn: req.isAuthenticated(),
    favoriteGames,
    scripts: [
      "https://unpkg.com/axios@0.21.0/dist/axios.min.js"
    ],
  });

  return; 
});


module.exports = router;
