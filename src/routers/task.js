const express = require("express");
const Task = require("../models/task");

const router = new express.Router();

router.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.get("/tasks", (req, res) => {
  Task.find({}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});

router.get("/tasks/:id", (req, res) => {
  Task.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(data);
  });
});

router.patch("/tasks/:id", (req, res) => {
  const allowedUpdates = ["description", "completed"];
  const updates = Object.keys(req.body);
  const isValidUpdate = updates.every((item) => allowedUpdates.includes(item));
  if (!isValidUpdate) return res.status(400).send("invalid update");
  Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { runValidators: true, new: true },
    (err, data) => {
      if (err) {
        return res.status(400).send(err);
      }
      if (!data) {
        return res.status(404).send("Task Not Found");
      }
      res.send(data);
    }
  );
});
router.delete("/tasks/:id", (req, res) => {
  Task.findByIdAndDelete(req.params.id, (err, data) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (!data) {
      return res.status(404).send("Task Not Found");
    }
    res.send(data);
  });
});

module.exports = router;
