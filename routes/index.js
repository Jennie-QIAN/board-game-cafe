const express = require('express');
const router  = express.Router();

const { findPlaysByLocation } = require('../queries/plays.query');
const { findAllGames, findLatestFeaturedGame } = require('../queries/games.query');

router.get('/', async (req, res, next) => {
  let userId,
      userName,
      userImg,
      location,
      favoriteGames = [];

  if (req.isAuthenticated()) {
    ({
      id: userId,
      username: userName,
      avatar: userImg,
      location,
      favoriteGames,
    } = req.user);
  }

  const [ games, plays, latestFeaturedGame ] = await Promise.all([
    findAllGames(),
    findPlaysByLocation(location),
    findLatestFeaturedGame()
  ]);
    
  res.render('index', {
    userId,
    userName,
    userImg,
    games,
    plays,
    latestFeaturedGame,
    favoriteGames,
    scripts: [
      "https://unpkg.com/axios@0.21.0/dist/axios.min.js"
    ],
  });

  return; 
});


module.exports = router;
