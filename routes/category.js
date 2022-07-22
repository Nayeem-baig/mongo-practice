const express = require("express");
const Category = require("../models/categoryModel");
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

// add a category
router.post("/add_category", async (req,res) =>{
    const category = new Category({
        name: req.body.category
    }
    );
    category.save(function(err) {
        if (err) {
          if (err.name === 'MongoError' || err.code === 11000) {
            // Duplicate username
            return res.status(422).send('Category already exist!');
          }
          // Some other error
          return res.status(422).send("err");
        }
        res.send("Category added")
    });
  });

  // delete a category
  router.delete("/delete",authenticateToken, async (req, res) => {
    const role = req.claims.role;
    if (role != "admin") {
      res.status(400).send("unauthorized");
      return;
    }
    const category = await Category.findById(req.body.id);
    if (category != null) {
      const c1 = await category.remove();
      res.status(200).send("Category deleted");
    } else {
      res.status(400).send("Category does not exist");
    }
  });

  // list all categories
  router.get("/list",authenticateToken, async (req, res) => {
    const role = req.claims.role;
    if (role != "admin") {
      res.status(400).send("unauthorized");
      return;
    }
    const category = await Category.find();
    res.json(category);
  });
  
  // update categories names
  router.patch("/update",authenticateToken, async (req, res) => {
    const role = req.claims.role;
    if (role != "admin") {
      res.status(400).send("unauthorized");
      return;
    }
    const category = await Category.findById(req.body.id);
    const name = req.body.name;
  
    if(category != null){
      if (name != null){
        category.name = name;
      }
    } else {
      res.status(404).send("category not found");
      return
    }
    const c1 = await category.save();
    res.send("Category name updated");
  });
  
  module.exports = router;