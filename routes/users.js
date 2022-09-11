const express = require("express");
const jwt = require("jsonwebtoken");
const Users = require("../models/usersModel");
const router = express.Router();
const Product = require("../models/productModel");
const { v4: uuidv4 } = require("uuid");
const { mongo } = require("mongoose");

// function to test token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
 
  jwt.verify(token, "secretkey", (err, claims) => {
    if (err) return res.sendStatus(403);
    req.claims = claims;
    next();
  });
}


// Listing single user details using the unique id int the token of the user - profile
router.get("/profile", authenticateToken, async (req, res) => {
  const users = await Users.findById(req.claims.uid);
  if (users == null) {
    res.status(400).send("Users does not exist");
  } else {
    res.json(users);
  }
});

router.get("/getuser", async (req ,res) => {
  const uid = (req.body.uid);
  const users = await Users.find({_id : uid});
  if (users != "null"){
  return res.send(users)
  }
  res.send("Not found")
})

// update profile api
router.patch("/profile/passwordupdate", authenticateToken, async (req, res) => {
  const user = await Users.findById(req.claims.uid);
  console.log(req.body)
  if (user != null) {
    const password = req.body.password;
    if (password === user.password) {
      return res.status(403).send("Old password and new password cannot be same!")
    }
    if (password != null) {
      user.password = password;
    }
  } else {
    res.status(404).send("User not found");
    return;
  }
  const u1 = await user.save();
  res.send("Password updated");
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
    res.status(400).send("Email already in use");
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
    res.status(400).send("User does not exist");
    return;
  }
  if (user.email != req.body.email) {
    res.status(400).send("invaild email address");
    return;
  }
  if (user.password != req.body.password) {
    res.status(404).send("Invalid pass! Try again.");
    return;
  }
  if (user.blockstatus) {
    res.status(400).send("Your account has been blocked");
    return;
  }
  const jti = uuidv4();
  const options = {
    issuer: "nodeServer",
    expiresIn: '24h',
    jwtid: jti,
  };

  const token = jwt.sign(
    { uid: user._id, rle: user.role , name: user.name},
    "secretkey",
    options
  );
  res.send(token);
});

//admin login api
router.post("/adminlogin", async (req, res) => {
  const users = await Users.find();
  const userData = users.filter((x) => x.email == req.body.email);
  let admin = userData[0];
  console.log(admin)
  if (userData.length == 0) {
    res.status(400).send("Admin does not exist");
    return;
  }
  if (admin.email != req.body.email) {
    res.status(400).send("invaild email address");
    return;
  }
  if (admin.password != req.body.password) {
    res.status(404).send("Invalid pass! Try again.");
    return;
  }
  if (admin.role != "admin") {
    res.status(404).send("Admin not found!");
    return;
  }
  const jti = uuidv4();
  const options = {
    issuer: "nodeServer",
    expiresIn: '24h',
    jwtid: jti,
  };

  const token = jwt.sign(
    { uid: admin._id, rle: admin.role},
    "secretkey",
    options
  );
  res.send(token);
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

// api for adding items in favourites list

router.post("/add_favourites", authenticateToken, async (req, res) => {
  const users = await Users.findById(req.claims.uid);
  const item = req.body.id;
  const itemIndb = await Product.findById(req.body.id);
  if (users == null) {
    res.status(404).send("User not found");
    return;
  }
  if (itemIndb == null) {
    res.status(404).send("Item not found");
    return;
  }
  const userFavs = users.favourites;
  const ispresent = userFavs.includes(item);

  if (ispresent) {
    res.status(409).send("Item already in fav list");
    return;
  }
  users.favourites.push(item);
  users.save();
  res.status(200).send(itemIndb.name + " Added to favourites");
});

// api to remove fav

router.delete("/del_favourites", authenticateToken, async (req, res) => {
  const user = await Users.findById(req.claims.uid);
  const itemID = req.body.id;
  if (itemID == null){
    res.status(400).send("Please send item id");
    return;
  }
  let isPresent = user.favourites.filter((item) => item == itemID);
  if(isPresent[0] == null){
    res.status(404).send("Item Not found in favourites");
    return;
  }
  let filteredData = user.favourites.filter((item) => item != itemID);
  user.favourites = filteredData;
  user.save();
  res.send("item removed from favourites");
});

// Display all favourites of the user

router.get("/display_favourites", authenticateToken, async (req, res) => {
  const users = await Users.findById(req.claims.uid);
  let fav = [];
  let favArr = users.favourites;
  for (i = 0; i < favArr.length; i++) {
    const id = favArr[i]
    let item = await Product.findById(id);
    fav.push(item);
  }
  res.send(fav);
});

// This endpoint takes a id of a user and blocks and unblocks it

router.patch("/blockUser", authenticateToken, async (req, res) => {
  const claims = req.claims;
  const users = await Users.findById(req.body.id);
  if (claims.rle != "admin") {
    res.status(404).send("You are not allowed to view this site");
    return;
  }
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

router.get("/listAllUsers", authenticateToken, async (req, res) => {
  const rle = req.claims.rle;
  if (rle != "admin") {
    res.status(400).send("unauthorized");
    return;
  }
  const user = await Users.find({role : "consumer"});
  res.json(user);
});


// this api is used to delete an user using its id
router.delete("/delete", authenticateToken, async (req, res) => {
  const claims = req.claims;
  const users = await Users.findById(req.body.id);
  if (users != null) {

    if (claims.rle == "admin") {
      const u1 = await users.remove();
      res.status(200).send("User deleted");
      return;
    }
    res.status(400).send("You cannot view this site");
    return;
  }
  res.status(400).send("Users does not exist");
});

module.exports = router;
