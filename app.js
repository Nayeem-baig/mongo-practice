const express = require("express");
const { default: mongoose } = require("mongoose");
const url = "mongodb://localhost/serverOne";



const app = express();

var cors = require("cors");
app.use(cors());

mongoose.connect(url);
app.use(express.json());
const con = mongoose.connection;

con.on("open", () => {
  console.log("Server online...");
});

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const productRouter = require("./routes/product");
app.use("/product", productRouter);

const categoryRouter = require("./routes/category");
app.use("/category", categoryRouter);

const ordersRouter = require("./routes/orders");
app.use("/orders", ordersRouter);

app.listen(4000, () => {
  console.log("Server listening on port 4000");
});










// const DB = 'mongodb+srv://nayeembaig:nayeembaig@cluster0.qu8jyfp.mongodb.net/Cafeteria?retryWrites=true&w=majority'
