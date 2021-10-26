// CRUD - create read update delete
const mongodb = require("mongodb"); // npm i mongodb
const MongoClient = mongodb.MongoClient;
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

    db.collection("users").insertOne({
      name: "Levw",
      age: 20,
    });
  } // view it from robo 3t
);
