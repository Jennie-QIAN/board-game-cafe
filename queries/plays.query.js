const Play = require('../models/Play.model.js');


function findPlaysByLocation(location) {
    let filter = {};

    if (location) {
        filter['location.city'] = location;
    }

    return Play.find(filter)
        .populate('gamesForPlay', 'name smImg')
        .populate('players', 'username avatar');
}

function findPlaysByGame(gameId) {
    let filter = {};

    if (gameId) {
        filter.gamesForPlay = gameId;
    }

    return Play.find(filter)
        .populate('gamesForPlay', 'name smImg')
        .populate('players', 'username avatar');
}

module.exports = {
    findPlaysByLocation,
    findPlaysByGame,
};
