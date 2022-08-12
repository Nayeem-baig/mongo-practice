const express = require("express");
const jwt = require("jsonwebtoken");
const Orders = require("../models/ordersModel");
const router = express.Router();
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

router.post("/",authenticateToken, async (req, res) => {
  const orders = new Orders({
    items : req.body.order,
    orderedBy : req.claims.uid,
  }
  );
  console.log(orders)
  await orders.save();
  res.send("Order succesuful")
});

module.exports = router;
