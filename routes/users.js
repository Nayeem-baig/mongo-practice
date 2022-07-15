require("dotenv").config();
const express = require("express");
const jwt = require('jsonwebtoken');
const Users = require("../models/users");
const router = express.Router();
const admin = "admin";
const consumer = "consumer";


// Listing all users in the database
router.get("/listAllUsers", async (req, res) => {
    const user = await Users.find();
    res.json(user);
});
// Listing single user details using the unique id of the user
router.get("/:id", async (req, res) => {

    const users = await Users.findById(req.params.id);
    if (users == null) {
      res.status(400).send("Users does not exist");
    } else {
      res.json(users);
    }
});
// Regestering user
router.post("/register", async (req, res) => {
  const users = new Users({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    phn: req.body.phn,
    password: req.body.password,
    blockstatus: req.body.blockstatus,
  });
    const u1 = await users.save();
    res.status(200).send("User added");
});

// This endpoint takes a id of a user and blocks and unblocks it
router.patch("/blockUser/:id", async (req, res) => {
    const users = await Users.findById(req.params.id);
    if (users.blockstatus == true) {
      users.blockstatus = "false";
      res.send("user unblocked");
    } else {
      users.blockstatus = "true";
      res.send("user blocked");
    }
    const u1 = await users.save();
});
// this api is used to delete an user using its id
router.delete("/delete/:id", async (req, res) => {
    const users = await Users.findById(req.params.id);
    if (users == null) {
      res.status(400).send("Users does not exist");
    } else {
      const u1 = await users.remove();
      res.status(200).send("User deleted");
    }
});
router.post("/login", async (req, res) => {
    const users = await Users.find();
    const userData = users.filter((x) => x.email == req.body.email);
    let user = userData[0];
    if(userData.length == 0){
        res.status(400);
      res.send("User does not exist");
      return;
    }
    if (user.email != req.body.email) {
      res.status(400);
      res.send("invaild email address");
      return;
    }
    if (user.password != req.body.password) {
      res.status(400).send("Invalid password");
      return;
    }
    if (user.blockstatus) {
      res.status(400).send("Your account has been blocked");
      return;
    }

    const accessToken = jwt.sign({userid: user.id , role: user.role}, "secretkey")
    res.send(accessToken)
    });
module.exports = router;