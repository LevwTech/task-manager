const express = require("express");
const User = require("../models/user");
const Task = require("../models/task");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail } = require("../mail/account");
const upload = multer({
  limits: {
    fileSize: 1000000, // in bytes
  },
  // called when a file wants to upload
  fileFilter(req, file, cb) {
    // regular expression for img extensions
    if (!file.originalname.match(/\.(jpe?g|png|gif|bmp)$/)) {
      return cb(new Error("File must be an Image")); // if things go bad
    }
    cb(undefined, true); // if things go well
  },
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
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

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const imageBuffer = await sharp(req.file.buffer)
      .png()
      .resize(200) // use client side tool also to resize
      .toBuffer();
    req.user.avatar = imageBuffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send(error.message);
  }
);
router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
});
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error("no user or no avatar");
    }
    // setting response header its application/json by default we change to image/jpg
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});
//           <img src="GET-REQ-URL"></img>

module.exports = router;
