const mongoose = require("mongoose");
const ordersSchema = new mongoose.Schema({
    items :{
        type: Array,
    },
    total:{
        type: Number,
    },
    orderedBy:{
        type: String,
    },
    customerName:{
        type: String,
    }
},
{
    timestamps: true
}
);

module.exports = mongoose.model("Orders", ordersSchema);
