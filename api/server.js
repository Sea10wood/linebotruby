'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;
const axios = require('axios');

const config = {
    channelSecret: 'bec3ec3cc56dd6d6930d36e236668d00',
    channelAccessToken: 'leXPLLqyYqp+B4/kZXn8S+dGvsqfPsjzk9F4zKg/sa51q18Mi50Yq3sCTY6URux9+zsiU8A4DITpupBeo/IqmPlPOAHQDRGYHZwvWeS7nBvzIqYHaWoNTrLZ2Y+5yg6/ldfEwb7Rx/tUW/anVxVtJAdB04t89/1O/w1cDnyilFU='
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result))
      .catch((err) => {
 	    console.error(err);
        res.status(500).end();
      });
});

const client = new line.Client(config);

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    if (event.message.text === 'にゃーん' || event.message.text === 'にゃーーーー') {
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'にゃー',
        });
    } else if (event.message.text === 'かわいい' || event.message.text === '可愛い'|| event.message.text === '可愛いね'|| event.message.text === 'かわいいね') {
        try {
            const response = await axios.get('https://api.thecatapi.com/v1/images/search');
            const catImageURL = response.data[0].url;
    
            const imageMessage = {
                type: 'image',
                originalContentUrl: catImageURL,
                previewImageUrl: catImageURL,
            };
    
            return client.replyMessage(event.replyToken, imageMessage);
        }catch (error) {
                console.error('猫の画像の取得中にエラーが発生しました', error);
            }
    } else {
        const randomMessages = ['にゃー', 'にゃーーーん', 'にゃぁ？','にゃっ！'];
        const randomIndex = Math.floor(Math.random() * randomMessages.length);
        const randomMessage = randomMessages[randomIndex];

        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: randomMessage,
        });
    }
  
}

(process.env.NOW_REGION) ? module.exports = app : app.listen(PORT);
console.log(`Server running at ${PORT}`);
