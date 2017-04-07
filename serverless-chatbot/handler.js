'use strict';

const https = require('https');
const qs = require('querystring');

const direct_mention = new RegExp('^\<\@' + process.env.BOT_ID + '\>', 'i');

module.exports.endpoint = (event, context, callback) => {
  const request = JSON.parse(event.body);

  if (request.type === 'url_verification' &&
      request.token === process.env.VERIFICATION_TOKEN) {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        'challenge': request.challenge
      })
    }

    return callback(null, response);
  }

  console.log(request.event);
  if (request.event.text.match(direct_mention)) {
    console.log("Directly mentioned - the bot will do something.");
    const response = {
      token: process.env.BOT_ACCESS_TOKEN,
      channel: request.event.channel,
      text: request.event.text.replace(direct_mention, '') + ' [' + Date.now() + ']'
    }

    const URL = process.env.POST_MESSAGE_URL + qs.stringify(response);

    https.get(URL, (res) => {
      const statusCode = res.statusCode;

      if (statusCode !== 200) {
        console.log(res);
      }

      callback(null, { statusCode: 200 });
    });
  }
};

/*
module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
*/
