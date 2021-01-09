const Comment = require('../models/Comment.model.js');

function findCommentsOfGame(gameId) {
    let filter = {};

    if (gameId) {
        filter.game = gameId;
    }

    return Comment.find(filter)
        .populate('author', 'avatar username')
        .catch(err => console.log(err));
}

module.exports = {
    findCommentsOfGame,
};