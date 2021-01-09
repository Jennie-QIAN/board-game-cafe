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

        shortDescription: {
            type: String,
            default: "Board Game Café's crème de la crème"
        },

        minPlayer: Number,

        maxPlayer: Number,

        gamePlayTime: Number,

        rate: [Number],

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

        createdBy: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        }
    },

    {
        timestamps: true
    }
);

module.exports = model('Game', gameSchema);