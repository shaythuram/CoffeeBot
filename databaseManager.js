'use strict';
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const { promisify } = require("es6-promisify");
const _ = require('lodash');


let dynamo = new AWS.DynamoDB.DocumentClient();

// const TABLE_NAME = process.env.ITEMS_DYNAMODB_TABLE;

// module.exports.saveOrderToDatabase = function(coffeeType, coffeeSize) {
//   console.log('saveOrderToDatabase');

//   const item = {};
//   item.orderId = uuidv4();
//   item.drink = coffeeType;
//   item.size = coffeeSize;


//   const params = {  
//       tableName:'coffee-order-table',
//       Item:item
    
//     }





//   const putAsync = promisify(dynamo.put, dynamo);

//   return putAsync(params)
//     .then(() => {
//       console.log(`Saving item `);
//       return item;
//     })
//     .catch(error => {
//       Promise.reject(error);
//     });
// }

module.exports.saveOrderToDatabase  = (userId ,coffeeType, coffeeSize) => {


  console.log('saveOrderToDatabase')

  const item = {};
  item.orderId = uuidv4();
  item.drink = coffeeType;
  item.size = coffeeSize;
  item.userId = userId;
  return saveItemToTable('coffee-order-table', item);

    
};


module.exports.saveUserToDatabase = function(userId, coffeeType, coffeeSize) {
  console.log('saveUserToDatabase');

  const item = {};
  item.drink = coffeeType;
  item.size = coffeeSize;
  item.userId = userId;

  return saveItemToTable('coffee-user-table', item);
};



module.exports.findUserFavorite= function(userId){
  const params ={
    TableName:'coffee-user-table',
    Key:{
      userId
    }
  }
  return dynamo.get(params).promise().then((thing) =>{
    console.log("W " , thing.Item.drink )
    return thing.Item
  })
}


function saveItemToTable(tableName , item){


  const params = {
    TableName: tableName,
    Item: item
  };

  return dynamo.put(params).promise().then(() => {
    console.log(`added ${item} ${tableName} ` );
    return item
  });      
}