// IMPORTING MONGO DB
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _db;

// CONNECTING TO THE DATABASE SERVER
const mongoConnect = (callback) => {
  // MongoClient.connect('mongodb+srv://japneetsinghh:sidak123@cluster0.ngs59ni.mongodb.net/?retryWrites=true&w=majority')
  MongoClient.connect('mongodb+srv://japneetsinghh:sidak123@cluster0.ngs59ni.mongodb.net/?retryWrites=true&w=majority')
    .then(client => {
      console.log('CONNECTED TO MONGODB');
      _db = client.db();// GETTING THE DATABASE IN _db
      callback();
    })
    .catch(err => {
      console.log(err);
    })
}

// SENDING DATABASE TO DIFFRENT FILES
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
}


exports.getDb = getDb;
exports.mongoConnect = mongoConnect;