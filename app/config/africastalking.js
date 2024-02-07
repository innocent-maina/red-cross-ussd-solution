const credentials = {
  apiKey: process.env.AT_SANDBOX_API_KEY,
  username: process.env.AT_SANDBOX_USERNAME,
};

const Africastalking = require('africastalking')(credentials);

const sms = Africastalking.SMS;
const voice = Africastalking.VOICE;

module.exports = {
  sms,
  voice,
};
