const express = require("express");
const Product = require("../models/productModel");
const router = express.Router();
const jwt = require("jsonwebtoken");

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

// Add product api
router.post("/add", authenticateToken, async (req, res) => {
  const rle = req.claims.rle;
  if (rle != "admin") {
    res.status(400).send("unauthorized");
    return;
  }
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    veg: req.body.veg,
    category: req.body.category,
    recommended: req.body.recommended,
    img: req.body.img,
  });
  if (req.body.name === "") {
    return res.status(400).send("Enter name");
  } else if (req.body.description === "") {
    return res.status(400).send("Enter description");
  } else if (req.body.price === "") {
    return res.status(400).send("Enter price");
  } else if (req.body.veg === "") {
    return res.status(400).send("Enter veg or non veg");
  } else if (req.body.category === "") {
    return res.status(400).send("Enter category");
  } else if (req.body.recommended === "") {
    return res.status(400).send("Enter recommended");
  } else if (req.body.img === "") {
    return res.status(400).send("Enter image link");
  }
  product.save(function (err) {
    if (err) {
      if (err.name === "MongoError" || err.code === 11000) {
        // Duplicate username
        return res.status(422).send("Product already exist!");
      }
      // Some other error
      return res.status(422).send("err");
    } else product.save();
    res.send("Product added");
  });
});

// Update product api

router.patch("/update", authenticateToken, async (req, res) => {
  const rle = req.claims.rle;
  if (rle != "admin") {
    res.status(400).send("unauthorized");
    return;
  }
  const product = await Product.findById(req.body.id);
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const veg = req.body.veg;
  const category = req.body.category;
  const img = req.body.img;

  if (product != null) {
    if (name != null) {
      product.name = name;
    }
    if (description != null) {
      product.description = description;
    }
    if (price != null) {
      product.price = price;
    }
    if (veg != null) {
      product.veg = veg;
    }
    if (category != null) {
      product.category = category;
    }
    if (img != null) {
      product.img = img;
    }
  } else {
    res.status(404).send("Product not found");
    return;
  }
  const p1 = await product.save();
  res.send(product + "Product updated");
});

//remove product api

router.delete("/delete", authenticateToken, async (req, res) => {
  const rle = req.claims.rle;
  if (rle != "admin") {
    res.status(400).send("unauthorized");
    return;
  }
  let productName;
  const product = await Product.findById(req.body.id);
  if (product == null){
    res.status(404).send("Product does not exist");
    return
  }
  if (product != null) {
    productName = product.name;
    const p1 = await product.remove();
    res.status(200).send(productName + " deleted");
    return
  } 
});

// Non veg items list view

router.get("/nonveg", authenticateToken, async (req, res) => {
  const claims = req.claims;
  if (claims == "null") {
    res.status(400).send("Please login first");
    return;
  }
  const product = await Product.find({ veg: false });
  res.send(product);
});

// veg items list view
router.get("/veg", authenticateToken, async (req, res) => {
  const claims = req.claims;
  if (claims == "null") {
    res.status(400).send("Please login first");
    return;
  }
  const product = await Product.find({ veg: true });
  res.send(product);
});

// categorized items list viewing
router.get("/:category", authenticateToken, async (req, res) => {
  const claims = req.claims;
  if (claims == "null") {
    res.status(400).send("Please login first");
    return;
  }
  const reqcategory = req.params.category;
  if (reqcategory === "all") {
    const product = await Product.find();
    res.send(product);
    return;
  }
  if (reqcategory === "recommended") {
    const product = await Product.find({ recommended: true });
    res.send(product);
    return;
  }
  console.log(req.params.category);

  if (req.params.category == reqcategory) {
    const product = await Product.find({ category: reqcategory });
    res.send(product);
    return;
  }
});

router.get("/recommended", authenticateToken, async (req, res) => {
  const claims = req.claims;
  if (claims == "null") {
    res.status(400).send("Please login first");
    return;
  }
  const product = await Product.find({ recommended: true });
  res.send(product);
  return;
});

router.get("/all", authenticateToken, async (req, res) => {
  const claims = req.claims;
  if (claims == " ") {
    res.status(400).send("Please login first");
    return;
  }
  const product = await Product.find();
  res.send(product);
});

module.exports = router;
