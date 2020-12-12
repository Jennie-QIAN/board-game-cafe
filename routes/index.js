const express = require('express');
const router  = express.Router();

const User = require('../models/User.model.js');
const Play = require('../models/Play.model.js');
const Game = require('../models/Game.model.js');

function findAllPlays() {
  return Play.find()
    .catch(err => console.log(err));
}

function findAllGames() {
  return Game.find()
    .catch(err => console.log(err));
}

router.get('/', async (req, res, next) => {
  const [ games, plays ] = await Promise.all([
    findAllGames(),
    findAllPlays()
  ]);
    
  res.render('index', {
    games,
    plays
  });

  return;

  if (req.isAuthenticated()) {
    const location = req.user.location;
    Play.find({ 'location.city': location })
      .then(plays => {
        res.render('index');
      })
      .catch(err => next(err));
  } else {
    
    
  }
  
});

module.exports = router;
