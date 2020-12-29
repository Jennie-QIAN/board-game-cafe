const express = require('express');
const router  = express.Router();

const { ensureAuthenticated } = require('../utils/middleware.js');

const Comment = require('../models/Comment.model.js');
const Game = require('../models/Game.model.js');
const User = require('../models/User.model.js');

const { findPlaysByGame } = require('../queries/plays.query');
const { findGameById, findAllGames } = require('../queries/games.query');
const { findCommentsOfGame } = require('../queries/comments.query');

const { uploadGameImg } = require('../configs/cloudinary.config');

router.get('/games', async (req, res, next) => {

    const { game, category, mechanic, minPlayer, maxPlayer } = req.query;

    const [ categories, mechanics, games  ] = await Promise.all([
        Game.distinct('category'),
        Game.distinct('mechanic'),
        findAllGames(game, category, mechanic, minPlayer, maxPlayer)
      ]);

    let userId,
        userName,
        userImg,
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

    res.render('games/games', {
        userId,
        userName,
        userImg,
        game,
        category,
        mechanic,
        minPlayer,
        maxPlayer,
        games,
        categories,
        mechanics,
        favoriteGames,
        scripts: [
            "https://unpkg.com/axios@0.21.0/dist/axios.min.js"
        ],
    });
});

router.get('/games/new', ensureAuthenticated, (req, res, next) => {
    const {
        id: userId,
        avatar: userImg,
        username: userName,
    } = req.user;
    res.render('games/new', {
        userId,
        userName,
        userImg,
    });
});

router.post('/games/new', uploadGameImg.single('image'), (req, res, next) => {
    let img;
    let smImg;
    if (req.file) {
    img = req.file.path;
    const BASE_PATH = 'https://res.cloudinary.com/zhennisapp/image/upload';
    const scaledHeight = '/c_scale,h_150';
    smImg = BASE_PATH + scaledHeight + img.replace(BASE_PATH, '');
    } else {
       img = 'https://via.placeholder.com/468x60';
       smImg = 'https://via.placeholder.com/150';
    }

    const {
        name,
        minPlayer,
        maxPlayer,
        gamePlayTime,
        description,
        shortDescription,
        yearOfPublish,
        designer,
        artist,
        publisher,
        category,
        mechanic,
    } = req.body;

    Game.create({
        name,
        minPlayer,
        maxPlayer,
        gamePlayTime,
        description,
        shortDescription,
        yearOfPublish,
        designer,
        artist,
        publisher,
        category,
        mechanic,
        img,
        smImg,
        createdBy: req.user,
    })
        .then(newGame => {
            const id = newGame._id;
            User.findByIdAndUpdate(req.user.id, { $push: {createdGames: id} })
                .then(() => res.redirect(`/games/${id}`))
                .catch(err => next(err));   
        })
        .catch(err => {
            console.log(err);
            res.redirect('/games/new');
        });   
});

router.get('/games/:id', async (req, res, next) => {
    const gameId = req.params.id;
    const [game, plays, comments] = await Promise.all([
        findGameById(gameId),
        findPlaysByGame(gameId),
        findCommentsOfGame(gameId)
    ]);

    const isLoggedIn = req.isAuthenticated();

    const isCreator = isLoggedIn? (req.user.id === game.createdBy.id) : false;

    let userId,
        userName,
        userImg,
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
    
    const ifFavorite = favoriteGames.includes(gameId);

    res.render('games/show', {
        userId,
        userName,
        userImg,
        game,
        plays,
        comments,
        isCreator,
        ifFavorite,
        scripts: [
            "https://unpkg.com/axios@0.21.0/dist/axios.min.js"
        ],
    });
});

router.post('/games/:id', (req, res) => {
    res.redirect(`/games/${req.params.id}/addcomment`);
});

router.get('/games/:id/edit', ensureAuthenticated, async(req, res, next) => {
    const gameId = req.params.id;
    const game = await findGameById(gameId);
    const isLoggedIn = req.isAuthenticated();

    const isCreator = isLoggedIn? (req.user.id === game.createdBy.id) : false;

    const {
        id: userId,
        username: userName,
        avatar: userImg,
    } = req.user;

    res.render('games/edit', {
        userId,
        userName,
        userImg,
        game,
        isCreator,
    });
});

router.post('/games/:id/edit', uploadGameImg.single('image'), (req, res, next) => {
    const gameId = req.params.id;

    const {
        name,
        minPlayer,
        maxPlayer,
        gamePlayTime,
        description,
        shortDescription,
        yearOfPublish,
        designer,
        artist,
        publisher,
        category,
        mechanic,
    } = req.body;

    let img;

    if (req.file) {
        img = req.file.path;
    } else {
        img = req.body.existingImage;
    }

    const BASE_PATH = 'https://res.cloudinary.com/zhennisapp/image/upload';
    const scaledHeight = '/c_scale,h_150';
    const smImg = BASE_PATH + scaledHeight + img.replace(BASE_PATH, '');

    const updatedGame = {
        name,
        minPlayer,
        maxPlayer,
        gamePlayTime,
        description,
        shortDescription,
        yearOfPublish,
        designer,
        artist,
        publisher,
        category,
        mechanic,
        img,
        smImg,
    };

    Game.findByIdAndUpdate(gameId, updatedGame)
        .then(() => res.redirect(`/games/${gameId}`))
        .catch(err => console.log(err));
});

router.post('/games/:id/delete', (req, res, next) => {
    Game.findByIdAndRemove(req.params.id)
        .then(()=> res.redirect('/games'))
        .catch(err => next(err));
});

router.get('/games/:id/addcomment', ensureAuthenticated, async (req, res) => {
    const game = await findGameById(req.params.id);
    const {
        id: userId,
        username: userName,
        avatar: userImg,
    } = req.user;
    res.render('games/comment', {
        userId,
        userName,
        userImg,
        game,
        isLoggedIn: req.isAuthenticated(),
    });
});

router.post('/games/:id/addcomment', async (req, res) => {
    const author = req.user.id;
    const game = req.params.id;
    const content = req.body.content;
    const comment = {
        author,
        game,
        content
    };

    await Comment.create(comment);

    res.redirect(`/games/${game}`);

});


module.exports = router;