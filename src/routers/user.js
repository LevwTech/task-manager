const express = require("express");
const User = require("../models/user");
const Task = require("../models/task");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "avatars" });
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});
// Method  for logging in
router.post("/users/login", (req, res) => {
  const credentials = Object.keys(req.body);
  const requiredCredentials = ["email", "password"];
  const isValidOperation = credentials.every((item) =>
    requiredCredentials.includes(item)
  );
  if (!isValidOperation) {
    return res.status(400).send("please send email and password");
  }
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user || err) return res.send("Invalid Credentials");
    bcrypt.compare(req.body.password, user.password).then((exists) => {
      if (exists) {
        const token = user.generateAuthToken();
        res.send({ user, token });
      } else res.send("User Not Found");
    });
  });
});
// Method 2 Login
// router.post("/users/login", async (req, res) => {
//   try {
//     const user = await User.findByCredentials(
//       req.body.email,
//       req.body.password
//     );
//     res.send(user);
//   } catch (e) {
//     res.status(400).send();
//   }
// });

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// router.get("/users/:id", async (req, res) => {   // no longer needed was just for educational purposes
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);

//     if (!user) {
//       return res.status(404).send();
//     }
//     const token = user.verifyAuthToken();
//     console.log(token);
//     res.send(user);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = await User.findById(req.user._id);

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    await Task.deleteMany({ owner: user._id });

    res.send(user);
    // another method
    // await req.user.remove();
    // res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/me/avatar", upload.single("avatar"), (req, res) => {
  res.send();
});

module.exports = router;
