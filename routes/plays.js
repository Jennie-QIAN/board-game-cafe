const express = require('express');
const router  = express.Router();

const Play = require('../models/Play.model.js');
const User = require('../models/User.model.js');

const { ensureAuthenticated } = require('../utils/middleware.js');

const { findPlaysByLocAndDate, findPlayById } = require('../queries/plays.query');

router.get('/plays', async (req, res, next) => {
    const {
        location,
        dateFrom,
        dateTo,
        page = 1,
    } = req.query;

    const limit = 12;

    const availableLocations = ["Paris", "Lyon", "Nice", "Hyères", "Corse"];
    const nonSelectedLocations = availableLocations.filter((loc => loc !== location));

    let userId,
        userName,
        userImg;

    if (req.isAuthenticated()) {
        ({
        id: userId,
        username: userName,
        avatar: userImg,
        } = req.user);
    }

    let totalPlays = [];
    try {
        totalPlays = await findPlaysByLocAndDate(location, dateFrom, dateTo);
    } catch(err) {
        console.error(err.message);
    }

    let plays = [];
    try {
        plays = await findPlaysByLocAndDate(location, dateFrom, dateTo)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
    } catch(err) {
        console.log(err.message);
    }

    const numOfPlays = totalPlays.length;
    const totalPages = Math.ceil(numOfPlays / limit);
    const needPagination = totalPages > 1;
    let pages = [];
    if (totalPages < 6) {
        for(let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else if (totalPages > 5 && page < 5) {
        pages = [1, 2, 3, 4, 5];
    } else if (page === totalPages - 1) {
        pages = [page - 3, page - 2, page -1, page, totalPages];
    } else if (page === totalPages) {
        pages = [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1,totalPages];
    } else {
        pages = [page - 2, page -1, page, page + 1, page + 2];
    }

    res.render('plays/plays', {
        location,
        dateFrom,
        dateTo,
        nonSelectedLocations,
        plays,
        userId,
        userName,
        userImg,
        needPagination,
        pages,
        totalPages,
        currentPage: page,
    });    
});

router.get('/plays/new', ensureAuthenticated, (req, res, next) => {
    const {
        id: userId,
        avatar: userImg,
        username: userName,
    } = req.user;
    res.render('plays/new', {
        userId,
        userName,
        userImg,
        scripts: [
            "https://unpkg.com/axios@0.21.0/dist/axios.min.js",
            "/javascripts/play-form.js"
        ],
    });
});

router.post('/plays/new', (req, res, next) => {
    const {
        datetime: dateTime,
        nameOfCommerce,
        street,
        postCode,
        city,
        moreInstruction,
        gamesForPlay,
        minPlayer,
        maxPlayer,  
    } = req.body;

    Play.create({
        organizer: req.user,
        dateTime,
        location: {
            city,
            postCode,
            nameOfCommerce,
            street,
            moreInstruction
        },
        gamesForPlay,
        minPlayer,
        maxPlayer
    })
        .then(newPlay => res.redirect(`/plays/${newPlay.id}`))
        .catch(err => console.log(err));

});

router.get('/plays/:id', async(req, res, next) => {
    let userId,
        userName,
        userImg,
        favoriteGames = [];
    
    const playId = req.params.id;
    const isLoggedIn = req.isAuthenticated();
    
    if (isLoggedIn) {
        ({
            id: userId,
            username: userName,
            avatar: userImg,
            favoriteGames,
         } = req.user);
    } 

    const play = await findPlayById(playId);
    const ifJoined = play.players.map(player => player._id).includes(userId);
    const isOrganizer = isLoggedIn? (req.user.id === play.organizer.id) : false;

    res.render('plays/show', {
        userId,
        userName,
        userImg,
        play,
        isOrganizer,
        favoriteGames,
        ifJoined,
        scripts: [
            "https://unpkg.com/axios@0.21.0/dist/axios.min.js",
            "/javascripts/join-play.js"
        ],
    });
});

router.get('/plays/:id/edit', ensureAuthenticated, async(req, res, next) => {
    const playId = req.params.id;
    const play = await findPlayById(playId);
    const isLoggedIn = req.isAuthenticated();

    const isOrganizer = isLoggedIn? (req.user.id === play.organizer.id) : false;

    const {
        id: userId,
        username: userName,
        avatar: userImg,
    } = req.user;

    res.render('plays/edit', {
        userId,
        userName,
        userImg,
        play,
        isOrganizer,
        scripts: [
            "https://unpkg.com/axios@0.21.0/dist/axios.min.js",
            "/javascripts/play-form.js"
        ],
    });
});

router.post('/plays/:id/edit', (req, res, next) => {
    const playId = req.params.id;
    const {
        dateTime,
        nameOfCommerce,
        street,
        postCode,
        city,
        moreInstruction,
        gamesForPlay,
        minPlayer,
        maxPlayer,
    } = req.body;

    const updatedPlay = {
        dateTime,
        location: {
            nameOfCommerce,
            street,
            postCode,
            city,
            moreInstruction,
        },
        gamesForPlay,
        minPlayer,
        maxPlayer,
    };

    Play.findByIdAndUpdate(playId, updatedPlay)
        .then(() => res.redirect(`/plays/${playId}`))
        .catch(err => console.log(err));
});

router.post('/plays/:id/delete', (req, res, next) => {
    Play.findByIdAndRemove(req.params.id)
        .then(()=> res.redirect('/plays'))
        .catch(err => next(err));
});

module.exports = router;