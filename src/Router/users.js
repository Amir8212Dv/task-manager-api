const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require('multer')
const gm = require('gm')
const { User } = require("../models/user");
const auth = require("../middleware/auth");
// const { sendWelcomeEmail , sendGoodbyeEmail } = require('../email/account')
const router = new express.Router();

// -----------------------------------------------------------------
router.post("/users/signup", async (req, res) => {
  const bodyData = req.body;
  bodyData.password = await bcrypt.hash(bodyData.password, 8);
  try {
    const user = await new User(bodyData);
    await user.save();
    const token = await user.generateAuthCode();
    try {
      // sendWelcomeEmail(user.email , user.name)
    } catch {}
    res.status(201).send(user.publicProfile(token));

  } catch (error) {
    res.status(400).send(error);
  }
});

// -----------------------------------------------------------------
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredential(req.body.email, req.body.password);
    const token = await user.generateAuthCode();
    res.status(200).send(user.publicProfile(token));
  } catch {
    res.status(400).send({ error: "Unable to login."});
  }
});
// -----------------------------------------------------------------

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.status(200).send("you logouted successfully");
  } catch {
    res.status(400).send({ error: "somethign went wrong!" });
  }
});
// -----------------------------------------------------------------

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("you logged out from all devises");
  } catch {
    res.status(400).send({ error: "something went wrong!" });
  }
});

  // -----------------------------------------------------------------

const upload = multer({
  limits : {
    fileSize : 1000000
  },
  fileFilter(req , file , callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('please upload image file.'))
    }
    callback(undefined , true)
  }
})
                                      // use multer as a middleware
router.post('/users/me/avatar' , auth , upload.single('avatar') , async (req , res) => {
  const buffer = gm(req.file.buffer).setFormat('png')
  req.user.avatar = buffer.sourceBuffer
  await req.user.save()
  res.status(200).send()
} , 

(error , req , res , next) => res.status(400).send({error : error.message}))


router.get("/users/me", auth, (req, res) => {
  res.status(200).send(req.user.publicProfile(req.token));
});

// -----------------------------------------------------------------

router.patch("/users/me", auth, async (req, res) => {
  const bodyData = req.body;
  if (bodyData.password)
  bodyData.password = await bcrypt.hash(bodyData.password, 8);
  User.findByIdAndUpdate(req.user._id , req.body, {
    new: true,
    runValidators: true,
  }).then(result => {
    if (!result) return res.status(404).send();
      res.status(201).send(result.publicProfile(req.token));
    })
    .catch(error => res.status(500).send(error));
  });
  // -----------------------------------------------------------------
  
  router.get('/users/me/avatar' , auth , async (req , res) => {
    try {
      if (!req.user.avatar) {
        throw new Error()
      }
      res.set('Content-Type' , 'image/png')
      res.status(200).send(req.user.avatar)
    } catch {
      res.status(404).send()
    }
  })
  
  // -----------------------------------------------------------------
  router.delete("/users/me", auth, async (req, res) => {
    try {
      await req.user.remove()
      try {
        sendGoodbyeEmail(req.user.email , req.user.name)
      } catch {}
      res.status(200).send('removed successfully')
  } catch (error) {
    res.status(400).send({error})
  } 
});

// -----------------------------------------------------------------
router.delete('/users/me/avatar' , auth , async (req , res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send(req.user.avatar)
})

module.exports = router;
 