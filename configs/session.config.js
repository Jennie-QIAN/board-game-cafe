const session = require('express-session');

const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User.model.js');

module.exports = app => {
    app.use(
    session({
        secret: process.env.SESS_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: { maxAge: 600000 }, // 60 * 1000 ms === 10 min
        store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 60 * 60 * 24 // 60 sec * 60min * 24h
        })
    })
    );

    passport.serializeUser((user, cb) => cb(null, user._id));
 
    passport.deserializeUser((id, cb) => {
      User.findById(id)
        .then(user => cb(null, user))
        .catch(err => cb(err));
    });
     
    passport.use(
      new LocalStrategy(
        { passReqToCallback: true },
        {
          usernameField: 'username', 
          passwordField: 'password' 
        },
        (username, password, done) => {
          User.findOne({ username })
            .then(user => {
              if (!user) {
                return done(null, false, { message: 'Incorrect username' });
              }
     
              if (!bcrypt.compareSync(password, user.password)) {
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
};