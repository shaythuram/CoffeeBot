'use strict';

const lexResponses = require('./lexResponses');
const databaseManager = require('./databaseManager');



const types = ['latte', 'americano', 'cappuccino', 'expresso'];
const sizes = ['double', 'normal', 'large'];

function buildValidationResult(isValid, violatedSlot, messageContent) {
  if (messageContent == null) {
    return {
      isValid,
      violatedSlot,

    };
  }
  return {
    isValid,
    violatedSlot,
    message: messageContent ,

  };
}

function buildUserFavoriteResult(coffee , size , messageContent) {
  return {
    coffee,
    size,
    message: messageContent ,
  };
}
function buildFulfilmentResult(fullfilmentState, messageContent) {
  return {
    fullfilmentState,
    message:messageContent
  };
}


function fullfilOrder(userId, coffeeType, coffeeSize) {
  console.log('fullfilOrder' + coffeeType + ' ' + coffeeSize)
  return databaseManager.saveOrderToDatabase(userId ,coffeeType, coffeeSize).then(item => {

    return buildFulfilmentResult('Fulfilled', `Thanks, your orderid ${item.orderId} has been placed and will be ready for pickup in the bar`);
  });
}

function validateCoffeeOrder(coffeeType, coffeeSize) {
    if (coffeeType && types.indexOf(coffeeType.toLowerCase()) === -1) {

      return buildValidationResult(false, 'coffee', `We do not have ${coffeeType}, would you like a different type of coffee?  Our most popular coffee is americano.`, );
    }
  
    if (coffeeSize && sizes.indexOf(coffeeSize.toLowerCase()) === -1) {

      return buildValidationResult(false, 'size', `We do not have ${coffeeSize}, would you like a different size of coffee? Our most popular size is normal.`, );
    }
  
    if (coffeeType && coffeeSize) {
      //Latte and cappuccino can be normal or large
      if ((coffeeType.toLowerCase() === 'cappuccino' || coffeeType.toLowerCase() === 'latte') && !(coffeeSize.toLowerCase() === 'normal' || coffeeSize.toLowerCase() === 'large')) {
        
        return buildValidationResult(false, 'size', `We do not have ${coffeeType} in that size. Normal or large are the available sizes for that drink.`, );
      }
  
      //Expresso can be normal or double
      if (coffeeType.toLowerCase() === 'expresso' && !(coffeeSize.toLowerCase() === 'normal' || coffeeSize.toLowerCase() === 'double')) {
        
        return buildValidationResult(false, 'size', `We do not have ${coffeeType} in that size. Normal or double are the available sizes for that drink.`, );
      }
  
      //Americano is always normal
      if (coffeeType.toLowerCase() === 'americano' && coffeeSize.toLowerCase() !== 'normal') {
        
        return buildValidationResult(false, 'size', `We do not have ${coffeeType} in that size. Normal is the available sizes for that drink.`, );
      }
    }
  
    return buildValidationResult(true, null, null);
  }
  

function findUserFavorite(userId){
  return databaseManager.findUserFavorite(userId).then(item=>{
    console.log("ONE" , item)
    return buildUserFavoriteResult(item.drink , item.size , `Hi ${userId} good to see you again, last time you were here you ordered a ${item.size} ${item.drink} would you like to order that again ?` )
  })
}



module.exports = function(intentRequest,callback) {

        

    var coffeeSize = intentRequest.currentIntent.slots.size
    var coffeeType = intentRequest.currentIntent.slots.coffee
    var userId = intentRequest.userId
    console.log(coffeeSize,coffeeType , userId )
    const source = intentRequest.invocationSource;
    const slots = intentRequest.currentIntent.slots;
    const validationResult = validateCoffeeOrder(coffeeType,coffeeSize);

    if(coffeeType == null && coffeeSize == null){
      return(findUserFavorite(userId).then(item=>{
        console.log(item , "TWO")
        {
          slots.size = item.size
          slots.coffee = item.coffee
          callback (lexResponses.confirmIntent(intentRequest.sessionAttributes , intentRequest.currentIntent.name , slots , item.message))
          return
        }
      })
      .catch(err => {
        callback (lexResponses.delegate(intentRequest.sessionAttributes , intentRequest.currentIntent.slots))
        retrun
      }
        ))
    }

    else{if (source === 'DialogCodeHook') {
        console.log("DialogCodeHook")
        // const slots = intentRequest.currentIntent.slots;
        // const validationResult = validateCoffeeOrder(coffeeType,coffeeSize);
        // const validationResult = validateCoffeeOrder(coffeeType,coffeeSize);
        if(!validationResult.isValid){
            slots[`${validationResult.violatedSlot}`]=null;
            callback(lexResponses.elicitSlot(intentRequest.sessionAttributes , intentRequest.currentIntent.name , slots ,validationResult.violatedSlot ,validationResult.message))
            return;
        }




        callback(lexResponses.delegate(intentRequest.sessionAttributes , intentRequest.currentIntent.slots));
        return;
    }
  }
    if (source === 'FulfillmentCodeHook'){
        console.log("FulfillmentCodeHook")
        return fullfilOrder(userId , coffeeType, coffeeSize).then(fullfiledOrder => {
          callback(lexResponses.close(intentRequest.sessionAttributes, fullfiledOrder.fullfilmentState, fullfiledOrder.message))
          return;
        });
    }
    
};