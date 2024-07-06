const MongoClient = require("mongodb").MongoClient;

async function connectToDatabase() {
  const uri = "mongodb://localhost:27017/";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("videojuegos_Practica");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

module.exports = {
  connectToDatabase,
};
