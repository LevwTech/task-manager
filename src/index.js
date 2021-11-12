const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const jwt = require("jsonwebtoken");
const token = jwt.sign({ _id: "1234" }, "secretanychars", {
  //optional options object
  expiresIn: "10 seconds",
});
console.log(jwt.verify(token, "secretanychars")); // { _id: '1234', iat: 1636734867 } otherwise an error

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
