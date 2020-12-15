const Play = require('../models/Play.model.js');


function findAllPlays(gameIds, location) {
    let filter = {};

    if (location) {
        filter['location.city'] = location;
    }

    if (gameIds) {
        filter.gamesForPlay = {$in: gameIds};
    }

    return Play.find(filter)
        .populate('gamesForPlay', 'name smImg')
        .populate('players', 'username avatar');
}


module.exports = {
    findAllPlays,
};
