const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const app = express();
const port = process.env.PORT || 3000;
app.use(userRouter);
app.use(taskRouter);
require("./db/mongoose"); // insures that the file runs and so db is connected
app.use(express.json()); // automatically parses json into objects so we can use them

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
