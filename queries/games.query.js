const Game = require('../models/Game.model.js');

function findAllGames() {
    return Game.find()
      .catch(err => console.log(err));
}

function findLatestFeaturedGame() {
return Game.find({isEditorPick: true}).sort({datePickedByEditor: -1})
      .then(featuredGames => featuredGames[0])
      .catch(err => console.log(err));
}

module.exports = {
    findAllGames,
    findLatestFeaturedGame,
};