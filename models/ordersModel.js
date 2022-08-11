const mongoose = require("mongoose");
const ordersSchema = new mongoose.Schema({
    items :{
        type: Array,
        required: true
    },
    orderedBy:{
        type: String,
    }
},
{

    timestamps: true
}
);

module.exports = mongoose.model("Orders", ordersSchema);
