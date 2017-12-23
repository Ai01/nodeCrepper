const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://localhost:27017/doubanMovies';

module.exports = {
  MONGO_URL,
  MongoClient,
};
