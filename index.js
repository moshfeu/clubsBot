const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const botToken = '524224286:AAFIlKTezfzOlI1zIp2BC30Ckg7H8B2pj5M';

// Create a bot that uses 'polling' to fetch new updates
const options = process.env.prod ? {
      webHook: {
        port: process.env.PORT
      }
    } : {
      polling: true
    };
const bot = new TelegramBot(botToken, options);
if (process.env.prod) {
  const appURL = 'https://wix-clubs-telebot.herokuapp.com/';
  bot.setWebHook(`${appURL}bot${botToken}`);
  console.log('setWebHook', appURL);
}

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  // bot.sendMessage(chatId, 'Received your message');
  console.log('-----',msg);
  if (msg.text === '/start') {
    bot.sendDocument(chatId, 'http://i.giphy.com/QdXfVLeFgNvG.gif');
  } else if (msg.text.includes('/give_me_a_compliment')) {
    bot.sendMessage(chatId, `You are ${['great', 'smart', 'handsome'][Math.floor(Math.random() * 3)]}!`);
  } else if (msg.text.includes('/love')) {
    bot.sendMessage(chatId, `Do you love me? (I'm a robot, remember?`, {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [
          ['Yes, you are the bot of my life ❤'],
          ['No, sorry there is another one...']
        ]
      })
    });
  } else if (msg.text.includes('/buttons')) {
    bot.sendMessage(chatId, 'Buttons', {
      reply_markup: {
        inline_keyboard: [
          [{
            text: 'Sample button',
            callback_data: '2'
          }]
        ]
      }
    });
  } else if (msg.chat.type === 'group') {
    bot.sendMessage(chatId, `${msg.from.first_name} ${msg.from.last_name}, be quiet!`);
  } else {
    bot.sendMessage(chatId, `You sent: ${msg.text}`);
  }

  bot.on('callback_query', (message) => {
    bot.sendMessage(message.message.chat.id, `The button's data is: ${message.data}`);
  });
});

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}