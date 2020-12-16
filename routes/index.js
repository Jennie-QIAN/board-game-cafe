const express = require('express');
const router  = express.Router();

const { findAllPlays } = require('../queries/plays.query');
const { findAllGames, findLatestFeaturedGame } = require('../queries/games.query');

router.get('/', async (req, res, next) => {
  let location;

  if (req.isAuthenticated()) {
    location = req.user.location;
  }
  
  const [ games, plays, latestFeaturedGame ] = await Promise.all([
    findAllGames(),
    findAllPlays(location),
    findLatestFeaturedGame()
  ]);
    
  res.render('index', {
    games,
    plays,
    latestFeaturedGame,
    isLoggedIn: req.isAuthenticated()
  });

  return; 
});


module.exports = router;
