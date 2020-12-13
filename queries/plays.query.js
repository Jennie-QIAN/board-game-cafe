const Play = require('../models/Play.model.js');


function findAllPlays(location) {
    let filter = {};

    if (location) {
        filter['location.city'] = location;
    }

    return Play.find(filter)
        .populate('gamesForPlay', 'name smImg')
        .populate('players', 'username avatar');
}


module.exports = {
    findAllPlays,
};
