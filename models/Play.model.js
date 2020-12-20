const { Schema, model } = require('mongoose');

const playSchema = new Schema(
    {
        organizer: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },

        dateTime: {
            type: Date, //ISODate "2017-04-25T09:40:48.193Z"
            min: Date.now
        },

        location: {
            country: {
                type: String,
                default: 'France'
            },
            city: String,
            postCode: String,
            nameOfCommerce: String,
            street: String,
            moreInstruction: String
        },

        gamesForPlay: [{
            type: Schema.Types.ObjectId, 
            ref: 'Game'
        }],

        minPlayer: Number,

        maxPlayer: Number,

        players: [{
            type: Schema.Types.ObjectId, 
            ref: 'User'
        }],
    },
    
    {
        timestamps: true
    }
);

module.exports = model('Play', playSchema);