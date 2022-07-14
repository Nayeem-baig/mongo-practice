const mongoose = require('mongoose')


const usersSchema = new mongoose.Schema({

      name: {
        type: String,
        required :true
    },username: {
        type: String,
        required :true
    },email: {
        type: String,
        required :true
    },password: {
        type: String,
        required :true
    },phn: {
        type: Number,
        required :true
    },blockstatus: {
        type: Boolean,
        required :true,
        default :false
    }
})

module.exports = mongoose.model('Users' , usersSchema)