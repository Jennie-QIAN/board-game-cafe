const session = require('express-session');

const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const bcryptjs = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

const User = require('../models/User.model.js');

module.exports = app => {

  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 600000 }, // 60 * 1000 ms === 10 min
      store: new MongoStore({
        mongooseConnection: mongoose.connection
      }),
      resave: true,
      saveUninitialized: false, // <== false if you don't want to save empty session object to the store
      ttl: 60 * 60 * 24 // 60 sec * 60min * 24h
    })
  );
  
  passport.serializeUser((user, done) => done(null, user._id));
  
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => done(null, user))
      .catch(err => done(err));
  });
  
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        User.findOne({ email })
          .then(user => {
            if (!user) {
              return done(null, false, { message: 'Incorrect email' });
            }
  
            if (!bcryptjs.compareSync(password, user.passwordHash)) {
              return done(null, false, { message: 'Incorrect password' });
            }
  
            done(null, user);
          })
          .catch(err => done(err));
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());


  passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/twitter/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log(profile.id);
 
      User.findOne({ twitterID: profile.id })
        .then(user => {
          if (user) {
            done(null, user);
            return;
          }
 
          User.create({ twitterID: profile.id })
            .then(newUser => {
              done(null, newUser);
              console.log('new user is created');
            })
            .catch(err => done(err)); // closes User.create()
        })
        .catch(err => done(err)); // closes User.findOne()
    }
  ));

};