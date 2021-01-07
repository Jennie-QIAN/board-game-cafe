require('dotenv').config();

const mongoose = require('mongoose');
const Game = require('../models/Game.model');

const axios = require('axios');
const parser = require('xml2json');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const baseBggApiUrl = "https://www.boardgamegeek.com/xmlapi2/";
const collectionParam = "collection?username=pikaq";
const gameIdParam = "thing?id=";

function getObjectFromBgg(url) {
    return axios.get(url)
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
            const items = JSON.parse(parser.toJson(res.data, options)).items.item;
            return Array.isArray(items) ? items : [items];
        })
        .catch(err => console.log(err));
}

function getPropertyValueFromApi(property, array) {
    return array.filter(object => object.type === property).map(object => object.value);
}

getObjectFromBgg(baseBggApiUrl + collectionParam)
    .then(bggCollection => {
        return bggCollection.map(game => game.objectid);
    })
    .then(bggGameIds => {
        const gamesPromises = bggGameIds.map(bggGameId => {
            return getObjectFromBgg(baseBggApiUrl + gameIdParam + bggGameId)
                .then(data => {
                    const { 
                        name: nameList, 
                        id: bggId, 
                        thumbnail: smImg, 
                        image: img,
                        description,
                        minplayers,
                        maxplayers,
                        playingtime,
                        yearpublished,
                        link
                    } = data[0];

                    const designer = getPropertyValueFromApi("boardgamedesigner", link);
                    const artist = getPropertyValueFromApi("boardgameartist", link);
                    const publisher = getPropertyValueFromApi("boardgamepublisher", link);
                    const category = getPropertyValueFromApi("boardgamecategory", link);
                    const mechanic = getPropertyValueFromApi("boardgamemechanic", link);

                    const game = {
                        name: Array.isArray(nameList) ? nameList[0].value : nameList.value,
                        bggId,
                        smImg,
                        img,
                        description: description.replace(/&#10;/g, '\n'),
                        minPlayer: minplayers.value,
                        maxPlayer: maxplayers.value,
                        gamePlayTime: playingtime.value,
                        yearOfPublish: yearpublished.value,
                        designer,
                        artist,
                        publisher,
                        category,
                        mechanic
                    };

                    return Game.create(game).catch(err => console.log(`An error occurred while creating a game fetched from BGG API: ${err}`));
                })

                .catch(err => console.log(err));
        });

        return Promise.all(gamesPromises);
    })
    .then(() => mongoose.connection.close())
    .catch(err => console.log(err));
