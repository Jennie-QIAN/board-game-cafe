// const mongoose = require('mongoose');
// const Game = require('../models/Game.model');

const axios = require('axios');
const parser = require('xml2json');

// const DB_NAME = 'board-game-salon';

// mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

const baseUrl = "https://www.boardgamegeek.com/xmlapi2/thing?id=";
const gameId = "237182";

axios.get(baseUrl + gameId)
    .then(res => {
        const options = {
            object: false,
            reversible: false,
            coerce: false,
            sanitize: true,
            trim: true,
            arrayNotation: false,
            alternateTextNode: false
        };
        return JSON.parse(parser.toJson(res.data, options));
    })
    .then(data => console.log(data.items.item))
    .catch(err => console.log(err));
