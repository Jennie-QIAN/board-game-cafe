const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
    {
        author: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        },

        game: {
            type: Schema.Types.ObjectId, 
            ref: 'Game'
        },

        rate: {
            type: Number
        },

        content: {
            type: String,
            maxlength: 800
        }
    },

    {
        timestamps: true
    }
);

module.exports = model('Comment', commentSchema);