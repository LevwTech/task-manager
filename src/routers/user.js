const express = require("express");
const User = require("../models/user");

const router = new express.Router();

router.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      console.log("User Added");
      res.status(201).send(user);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.get("/users", (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});
router.get("/users/:id", (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).send(data);
  });
});
router.patch("/users/:id", (req, res) => {
  const allowedUpdates = ["name", "email", "password", "age"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((item) => allowedUpdates.includes(item));
  if (!isValidUpdate) return res.status(400).send("invalid update");
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { runValidators: true, new: true },
    (err, data) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (!data) {
        return res.status(404).send("User Not Found");
      }
      res.send(data);
    }
  );
});
router.delete("tasks/:id", (req, res) => {
  Task.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!data) {
      return res.status(404).send("User Not Found");
    }
    res.send(data);
  });
});

router.delete("/users/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!data) {
      return res.status(404).send("User Not Found");
    }
    res.send(data);
  });
});

module.exports = router;
