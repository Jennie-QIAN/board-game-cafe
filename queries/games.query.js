const Game = require('../models/Game.model.js');

function findGameById(id) {
    return Game.findById(id)
        .catch(err => console.log(err));
}

function findAllGames(game, category, mechanic, minPlayer, maxPlayer) {
    let filter = {};

    if (game) {
        filter.name = {
            $regex: game,
            $options: 'i'
        };
    }

    if (category) {
        filter.category = category;
    }

    if (mechanic) {
        filter.mechanic = mechanic;
    }

    if (minPlayer) {
        filter.minPlayer = { $lte: minPlayer };
    }

    if (maxPlayer) {
        filter.maxPlayer = { $gte: minPlayer };
    }

    return Game.find(filter);
}


function findLatestFeaturedGame() {
return Game.find({isEditorPick: true}).sort({datePickedByEditor: -1})
      .then(featuredGames => featuredGames[0]);
}

module.exports = {
    findGameById,
    findAllGames,
    findLatestFeaturedGame,
};