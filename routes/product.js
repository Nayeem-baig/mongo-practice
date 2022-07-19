const express = require("express");
const Product = require("../models/productModel");
const router = express.Router();

// Add product api
router.post("/add", async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    veg: req.body.veg,
    category: req.body.category,
    recommended:req.body.recommended
  });
  // try{
  //   const u1 = await product.save();
  //   res.status(200).send("Product added");
  // }catch(err){
  //   res.send("Error product name already exists")
  //}
  product.save(function(err) {
    if (err) {
      if (err.name === 'MongoError' || err.code === 11000) {
        // Duplicate username
        return res.status(422).send('Product already exist!');
      }
      // Some other error
      return res.status(422).send("err");
    }

    res.send("Product added")
  });
});

// Update product api

router.patch("/update", async (req, res) => {
  const product = await Product.findById(req.body.id);
  const name = req.body.name;
  const description = req.body.description;
  const price = req.body.price;
  const veg_nonveg = req.body.veg_nonveg;

  if(product != null){
    if (name != null){
      product.name = name;
    }
    if (description != null){
      product.description = description;
    }
    if (price != null){
      product.price = price;
    }
    if (veg_nonveg != null){
      product.veg_nonveg = veg_nonveg;
    }
  } else {
    res.status(404).send("Product not found");
    return
  }
  const p1 = await product.save();
  res.send(product + "Product updated");
});

//remove product api

router.delete("/delete", async (req, res) => {
  const product = await Product.findById(req.body.id);
  if (product != null) {
    const u1 = await product.remove();
    res.status(200).send("Product deleted");
  } else {
    res.status(400).send("Product does not exist");
  }
});

// Non veg items list view

router.get("/nonveg", async (req, res) => {
  const product = await Product.find({ veg: false });
  res.send(product);
});

// veg items list view
router.get("/veg", async (req, res) => {
  const product = await Product.find({ veg: true });
  res.send(product);
});

// categorized items list viewing
router.get("/:category", async (req, res) => {
  if(req.params.category == "all"){
    const product = await Product.find();
    res.send(product);
  }else if(req.params.category == "recommended"){
    const product = await Product.find({ recommended: true });
    res.send(product);
      return;
    }
  const product = await Product.find({category:req.params.category});
  res.send(product);
});

module.exports = router;