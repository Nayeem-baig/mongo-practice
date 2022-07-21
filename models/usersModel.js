const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        required :true,
    },phn: {
        type: Number,
        required :true
    },blockstatus: {
        type: Boolean,
        required :true,
        default :false
    }, role: {
        type: String,
        required :true,
        default :"consumer"
    }
})


// usersSchema.pre('save',async function (next) {
// const salt = await bcrypt.genSalt(8);
// const hashed = await bcrypt.hash(this.password ,salt)
// this.password = hashed;
// next()
// })
// usersSchema.methods.isValidPassword = async function (password){
//     return await bcrypt.compare (password, this.password)
// }
module.exports = mongoose.model('Users' , usersSchema)