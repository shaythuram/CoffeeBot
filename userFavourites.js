'use strict'



const databasemanager = require('./databaseManager');
module.exports = function (userId , drink ,size){
    console.log(userId+' ' + drink + ' ' + size);
    databasemanager.saveUserToDatabase(userId, drink , size).then(item => {
        console.log(item)
    })
}