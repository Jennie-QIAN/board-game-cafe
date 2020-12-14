const express = require('express');
const router  = express.Router();
const url = require('url');

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

// Using req.query to pqss variable to the redirected route

// router.post('/', (req, res, next) => {
//   const { game, location, btn: toRoute} = req.body;

//   if(toRoute === "play") {
//     res.redirect(url.format({
//       pathname:"/plays",
//       query: {
//         game,
//         location
//       }
//     }));
//   } else if(toRoute === "game") {
//     res.render('games/games', { game });
//   }
// });

router.post('/', (req, res, next) => {
  const { game, location, btn: toRoute} = req.body;
  req.session.search = {
    game,
    location
  };
  
  if(toRoute === "play") {
    res.redirect('/plays');
  } else if(toRoute === "game") {
    res.redirect('games');
  }
});

module.exports = router;
