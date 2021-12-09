const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const productRouter = require("./routers/product"); // remove temp

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(productRouter); // remove temp

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
