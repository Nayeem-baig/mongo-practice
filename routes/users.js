require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/usersModel");
const router = express.Router();

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
  const dbuser = await Users.find();
  const userData = dbuser.filter((x) => x.email == req.body.email);
  let user = userData[0];
  if (user != null) {
    res.status(400).send(req.body.email + " email already in use");
    return;
  }
  if (req.body.password.length < 6) {
    res.status(400).send("Minimum password length is 6 chars");
    return;
  }
  const u1 = await users.save();
  res.status(200).send("User added");
});

// login api
router.post("/login", async (req, res) => {
  const users = await Users.find();
  const userData = users.filter((x) => x.email == req.body.email);
  let user = userData[0];
  if (userData.length == 0) {
    res.status(400);
    res.send("User does not exist");
    return;
  }
  if (user.email != req.body.email) {
    res.status(400);
    res.send("invaild email address");
    return;
  }
  if (user.password != req.body.password){
    res.status(404).send("Invalid pass")
    return;
  }
  if (user.blockstatus) {
    res.status(400).send("Your account has been blocked");
    return;
  }
  const options = {
    expiresIn: "1h",
  };
  
  const accessToken = jwt.sign(
    { userid: user.id, role: user.role },
    "secretkey",
    options
  );
  res.json({
    userName: user.name,
    userRole: user.role,
    userId: user.id,
    accessToken: accessToken,
  });
});
// forgot password api
router.post("/forgotpassword", async (req, res) => {
  const newpassword = req.body.newpassword;
  const users = await Users.findOne({ email: req.body.email });
  const oldpassword = users.password;

  if (oldpassword == newpassword) {
    res.send("New pass and old pass cannot be same");
    return;
  }
  if (users != null) {
    users.password = newpassword;
    users.save();
    res.send("Password updated");
    return;
  } else {
    res.send("Email id does not exist");
  }
});

// This endpoint takes a id of a user and blocks and unblocks it
router.patch("/blockUser", async (req, res) => {
  const users = await Users.findById(req.body.id);
  if (users == null) {
    res.send("User does not exist");
    return;
  }
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

module.exports = router;