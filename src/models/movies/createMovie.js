const { MongoClient, MONGO_URL } = require('../../servers/databaseServer/mongodb');

const insertData = async (database, callback, data) => {
  //连接到表 movies
  const myDb = database.db('doubanMovies');
  const collection = await myDb.collection('movies');
  //插入数据
  await collection.insert(data, function(err, result) {
    if (err) {
      console.log('Error:' + err);
      return;
    }
    callback(result);
  });
};

const createMovies = movies => {
  MongoClient.connect(MONGO_URL, (err, database) => {
    console.log('连接成功！');
    if (err) {
      console.log(err);
      return null;
    }
    insertData(
      database,
      result => {
        console.log(result);
      },
      movies,
    );
  });
};

module.exports = {
  createMovies,
};
