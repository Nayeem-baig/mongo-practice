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
// place order api
router.post("/",authenticateToken, async (req, res) => {
  const orders = new Orders({
    items : req.body.order,
    total: req.body.total,
    orderedBy : req.claims.uid,
  }
  );
  console.log(orders)
  await orders.save();
  res.send("Order succesuful")
});
// order history by token user
router.get("/orderhistory",authenticateToken ,async (req , res) => {
  const orders = await Orders.find();
  const uid = req.claims.uid;
  const userOrders = orders.filter((product) => product.orderedBy == uid )
  res.send(userOrders);
})

router.get("/listallorder" ,authenticateToken, async (req , res)=>{
  const claims = req.claims;
  console.log(claims)
  if(claims.rle !== "admin"){
   return res.status(403).send("User not allowed");
  }
  const orders = await Orders.find();
  res.send(orders);
})

module.exports = router;
