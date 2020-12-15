const mongoose = require('mongoose');
const Play = require('../models/Play.model');

const DB_NAME = 'board-game-salon';

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const plays = [
    {
        organizer: '5fd5359958da9d9166b9aa8b',
        dateTime: '2020-12-13T15:00:00.000+00:00',
        location: {
            country: 'France',
            city: 'Paris',
            postCode: '75002',
            nameOfCommerce: 'Dernier bar avant la fin du monde',
            street: 'Rue du Louvre',
            moreInstruction: 'Meet me there'
        },
        gamesForPlay: ['5fd67ff0438c5cb0dac52b69', '5fd67ff0438c5cb0dac52b6f'],
        minPlayer: 3,
        maxPlayer: 6,
        players: ['5fd5359958da9d9166b9aa8b']
    },

    {
        organizer: '5fd53d25b091899367b046ac',
        dateTime: '2020-12-15T20:00:00.000+00:00',
        location: {
            country: 'France',
            city: 'Hyère',
            postCode: '83001',
            nameOfCommerce: 'Bar des écumes',
            street: 'Rue de la Plage',
            moreInstruction: 'Rendez-vous ici'
        },
        gamesForPlay: ['5fd67ff0438c5cb0dac52b6d', '5fd67ff0438c5cb0dac52b62'],
        minPlayer: 2,
        maxPlayer: 10,
        players: ['5fd53d25b091899367b046ac', '5fd5359958da9d9166b9aa8b']
    },
];

Play.create(plays)
    .then(() => {
        console.log("plays created in DB");
        mongoose.connection.close();
    })
    .catch(err => console.log(`An error occurred while creating plays to the DB: ${err}`))
    