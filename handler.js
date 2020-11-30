

const dispatch = require('./dispatch');
const userFavourites = require('./userFavourites');
module.exports.intents = (event, context, callback) => {
  try {
    console.log(`event.bot.name=${event.bot.name}`);
    dispatch(event,(response) => 
      callback(null, response));
  } catch (err) {
    callback(err);
  }
};

module.exports.saveUserFavorites = (event, context, callback) => {
  console.log('saveUserFavorites lambda called');
  console.log(event);
  var item = event.Records[0].dynamodb.NewImage;
  console.log(item );

  userFavourites(item.userId.S, item.drink.S, item.size.S);
  callback(null, null);
};