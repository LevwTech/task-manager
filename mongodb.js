// CRUD - create read update delete
const mongodb = require("mongodb"); // npm i mongodb
// const MongoClient = mongodb.MongoClient;
const { MongoClient, ObjectId } = mongodb;
const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager"; // or any name project related

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    // called when connected to the database, only error or client one of them is defined
    if (error) {
      console.log("Unable to connect to database");
      return;
    }
    console.log("Connected to database");

    const db = client.db(databaseName);
    db.collection("users").deleteOne({ name: "Levw" }, (error, result) => {
      console.log(result);
    });
    db.collection("users").deleteMany({ age: 20 }, (error, result) => {
      console.log(result);
    });
  }
);
