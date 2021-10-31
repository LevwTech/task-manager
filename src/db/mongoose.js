const mongoose = require("mongoose"); // npm i mongoose
// Correcting & Connecting DB, just add /DB_NAME in url
mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
});
// Creating Model (collection)
const Task = mongoose.model("Task", {
  descripton: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
});
// Creating new instance of model (document)
const read = new Task({
  descripton: "Read the nodejs book",
  completed: false,
});
// Saving document
read
  .save()
  .then(() => {
    console.log(read);
  })
  .catch((error) => {
    console.log("Error!", error);
  });
