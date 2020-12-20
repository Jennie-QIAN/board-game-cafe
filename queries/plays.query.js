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

function findPlayById(id) {
    return Play.findById(id)
        .populate('organizer', 'username avatar')
        .populate('gamesForPlay', 'name smImg designer')
        .populate('players', 'username avatar')
        .catch(err => console.log(err));
}

module.exports = {
    findPlaysByLocation,
    findPlaysByGame,
    findPlayById,
};
