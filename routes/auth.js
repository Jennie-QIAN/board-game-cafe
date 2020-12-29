const { Router } = require('express');
const router = new Router();

const mongoose = require('mongoose');
const User = require('../models/User.model.js');
const Play = require('../models/Play.model.js');
const Game = require('../models/Game.model.js');

const bcryptjs = require('bcrypt');
const saltRounds = 10;

const passport = require('passport');

const { ensureAuthenticated } = require('../utils/middleware.js');

router.get('/register', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.render('auth/register');
  } else {
    const {
      id: userId,
      username: userName,
      avatar: userImg,
    } = req.user;

    res.status(403).render('error', {
      userId,
      userName,
      userImg,
      errorMessage: "Hey, you are already loggedin!"
    });
  }
});

router.post('/register', (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.render('auth/register', { errorMessage: 'Hey there, all fileds are mandatory.'});
        return;
    }

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
            .status(500)
            .render('auth/register', { errorMessage: 'Password should have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter' });
        return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                username,
                email,
                passwordHash: hashedPassword
            });
        })
        .then(userFromDB => {
            res.redirect('/userProfile');
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
                res.status(500).render('auth/register', { errorMessage: error.message});
            } else if (error.code === 11000) {
                res.status(500).render('auth/register', { errorMessage: "Username and email should be unique. Either of them is already used. Try something else"});
            } else {
                next(error);
            }
        });
});

router.get('/login', (req, res) => {
  if (!req.isAuthenticated()) {
    res.render('auth/login');
  } else {
    const {
      id: userId,
      username: userName,
      avatar: userImg,
    } = req.user;

    res.status(403).render('error', {
      userId,
      userName,
      userImg,
      errorMessage: "Hey, you are already loggedin!"
    });
  }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
      if (err) {
        // Something went wrong authenticating user
        return next(err);
      }
   
      if (!theUser) {
        res.render('auth/login', { errorMessage: failureDetails.message });
        return;
      }
   
      // save user in session: req.user
      req.login(theUser, err => {
        if (err) {
          // Session save went bad
          return next(err);
        }
   
        // All good, we are now logged in and `req.user` is now set
        res.redirect('/');
      });
    })(req, res, next);
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { 
    successRedirect: '/userProfile',
    failureRedirect: '/login' 
  }));

router.get('/userProfile', ensureAuthenticated, async (req, res) => {
  const {
    id: userId,
    avatar: userImg,
    username: userName,
    favoriteGames,
  } = req.user;

  const [
    playsOrganized,
    playsParticipate,
    gamesCreated,
    favGamesPopulated
  ] = await Promise.all([
    Play.find({organizer: userId})
      .populate('gamesForPlay', 'smImg name')
      .populate('players', 'username avatar'),
    Play.find({players: userId})
      .populate('gamesForPlay', 'smImg name')
      .populate('players', 'username avatar'),
    Game.find({createdBy: userId}),
    User.findById(userId)
      .populate('favoriteGames', 'smImg name designer')
      .then(userData => userData.favoriteGames)
  ]);

  res.render('user/userProfile', { 
    userId,
    userImg,
    userName,
    playsOrganized,
    playsParticipate,
    gamesCreated,
    favoriteGames,
    favGamesPopulated,
  });
});

// router.post('/userProfile', (req, res) => {

// })

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;