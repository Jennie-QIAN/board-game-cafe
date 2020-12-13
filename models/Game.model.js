const { Schema, model } = require('mongoose');

const gameSchema = new Schema(
    {
        name: {
            type: String,
            trim: true
        },

        bggId: String,

        smImg: String,

        img: String,

        description: String,

        minPlayer: Number,

        maxPlayer: Number,

        gamePlayTime: Number,

        rate: {
            type: Number,
            default: null
        },

        yearOfPublish: String,

        designer: [String],

        artist: [String],

        publisher: [String],

        category: [String],

        mechanic: [String],

        isEditorPick: {
            type: Boolean,
            default: false
        },

        datePickedByEditor: {
            type: Date
        },

        editorNote: String,

        comments: [{
            type: Schema.Types.ObjectId, 
            ref: 'Comment'
        }]
    },

    {
        timestamps: true
    }
);

module.exports = model('Game', gameSchema);