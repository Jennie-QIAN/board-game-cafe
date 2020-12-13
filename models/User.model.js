const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            //required: [true, 'Username is required.'],
            unique: true
        },

        email: {
            type: String,
            //required: [true, 'Email is required.'],
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
            unique: true,
            lowercase: true,
            trim: true
        },

        twitterID: String,

        location: String,

        passwordHash: {
            type: String,
            //required: [true, 'Password is required']
        },

        bio: String,

        avatar: String,

        favoriteGames: [{
            type: Schema.Types.ObjectId, 
            ref: 'Game'
        }],

        numberOfPlays: {
            type: Number,
            default: 0
        },

        comments: [{
            type: Schema.Types.ObjectId, 
            ref: 'Comment'
        }]
    },

    {
        timestamps: true
    }
);

module.exports = model('User', userSchema);