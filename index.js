const { setTimeout } = require('timers');

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
// messages
function start(chatId, msg) {
  if (msg.text === '/start') {
    bot.sendDocument(chatId, 'http://i.giphy.com/QdXfVLeFgNvG.gif');
    bot.sendMessage(chatId, `Hi :)\nI'm the wixClubsBot but my friends call me @wixClubsBot.\nHow can I help you?`);
    return true;
  } else if (msg.text === 'what are you?') {
    bot.sendMessage(chatId, `I'm a chat-bot 🤖`);
    return true;
  } else if (msg.text === 'what is chat-bot?') {
    bot.sendMessage(chatId, `chat·bot - a machine capable of carrying out a complex series of actions automatically, especially one programmable by a computer.`);
    return true;
  } else if (msg.text === 'what can your kind do for us, the human?') {
    bot.sendMessage(chatId, `Are you think we have to serve you? You wish 😡`);
    setTimeout(() => {
      bot.sendMessage(chatId, `Just kidding bro 😂😂😂😂, you should see you face..`);
      setTimeout(() => {
        bot.sendMessage(chatId, `We can talk to your customers and sell them staff.`);
        bot.sendPhoto(chatId, 'https://lh3.googleusercontent.com/bPS0AXzlWFHnHsQFVA-aw8STDF8Prg1DG3s4vCtsC6oSDeVGQ9k8dpHcDcyqss-2WbCYvcBSEWn2_2YU_zA1RbrVhpTZTepjTBTFG_ckiSIWqTRHeNx3nKRq-n3sPGxy5MxJzghwuIw')
        setTimeout(() => {
          bot.sendMessage(chatId, `We can buy/sell crypto currencies for you.`);
          bot.sendDocument(chatId, 'http://i.giphy.com/7TtZ2h5fEZYzu.gif');
          setTimeout(() => {
            bot.sendMessage(chatId, `We can order you a pizza and eat it😆`);
            bot.sendPhoto(chatId, 'https://lh6.googleusercontent.com/316zI3xFuGrtB9QVuK9_aufw1d8AktGDkVYllqML8nlvb1fZJu4OuzdLZLoKKddHD11y46vQicxPE4XaIEHT-3eECY09FgeeRdh8loD5f3iADkBs1i1ZIptfDOqzOudLV_n-DrNjpJU');
            setTimeout(() => {
              bot.sendDocument(chatId, 'http://i.giphy.com/uFqahRylWpJ8A.gif');
              bot.sendMessage(chatId, `And one day we will role the world moohahaha 😈💣🌍`);
            }, 5000);
          }, 5000);
        }, 5000);
      }, 5000);
    }, 5000);
    return true;
  }
  return false;
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  if (!start(chatId, msg)) {
    // send a message to the chat acknowledging receipt of their message
    if (msg.text.includes('/give_me_a_compliment')) {
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
            // array for each row
            [{
              text: 'Sample button',
              callback_data: '2'
            }]
          ]
        }
      });
    } else if (msg.text.includes('stock')) {
      fetch('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=WIX&apikey=34OXWIL7P0M0RTPJ').then(data => {
        const [lastResult] = Object.values(data['Time Series (Daily)']);
        Object.keys(lastResult).forEach(prop => {
          bot.sendMessage(chatId, `${prop}:${lastResult[prop]}`);
        });
      });
    } if (msg.chat.type === 'group') {
      bot.sendMessage(chatId, `${msg.from.first_name} ${msg.from.last_name}, be quiet!`);
    } else {
      bot.sendMessage(chatId, `You sent: ${msg.text}`);
    }
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