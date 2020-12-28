const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            unique: true
        },

        email: {
            type: String,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
            unique: true,
            lowercase: true,
            trim: true
        },

        twitterID: String,

        location: String,

        passwordHash: String,

        bio: String,

        avatar: String,

        favoriteGames: [{
            type: Schema.Types.ObjectId, 
            ref: 'Game'
        }],

        createdGames: [{
            type: Schema.Types.ObjectId, 
            ref: 'Game'
        }],

        comments: [{
            type: Schema.Types.ObjectId, 
            ref: 'Comment'
        }],

        organizedPlays: [{
            type: Schema.Types.ObjectId, 
            ref: 'Play'
        }],

        joinedPlays: [{
            type: Schema.Types.ObjectId, 
            ref: 'Play'
        }],
    },

    {
        timestamps: true
    }
);

module.exports = model('User', userSchema);