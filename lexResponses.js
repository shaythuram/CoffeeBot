
'use strict';

module.exports.delegate = function(sessionAttributes, slots) {
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Delegate',
      slots
    }
  };
};


module.exports.elicitSlot = function(sessionAttributes, intentName, slots, slotToElicit, message) {
  console.log(slots, slotToElicit , "elicitSlo0ooot")
  return {
    sessionAttributes,
    "dialogAction": {
      "type": 'ElicitSlot',
      "intentName":intentName,
      "slots":slots,
      "slotToElicit":slotToElicit,
      "message": {
        "contentType": "PlainText",
        "content": message
      }

    }
  };
};

module.exports.close = function(sessionAttributes, fulfillmentState, message) {
  return {
    sessionAttributes,
    "dialogAction": {
      "type": "Close",
      "fulfillmentState": "Fulfilled",
      "message": {
          "contentType": "PlainText",
          "content": message
      }
  }
  };
};

module.exports.confirmIntent = function(sessionAttributes, intentName, slots, message) {
  return {
    sessionAttributes,
    "dialogAction": {
      "type": "ConfirmIntent",
      "intentName":intentName,
      "slots":slots,
      "message": {
          "contentType": "PlainText",
          "content": message
      }
  }
  };
};