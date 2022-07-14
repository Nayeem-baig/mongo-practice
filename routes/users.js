const { response } = require('express')
const express = require('express')
const users = require('../models/users')
const Users = require('../models/users')
const router = express.Router()


router.get('/', async(req ,res)=>{
    try{
        const user = await Users.find()
        res.json(user)
    }catch(err){
        res.send("Error " + err)
    }
})

router.get('/:id', async(req ,res)=>{
    try{
        const users = await Users.findById(req.params.id)
        res.json(users)
    }catch(err){
        res.send("Error " + err)
    }
})

router.post('/', async(req ,res) =>{
    const users = new Users ({
        name : req.body.name,
        username :req.body.username,
        email :req.body.email,
        phn :req.body.phn,
        password :req.body.password,
        blockstatus :req.body.blockstatus
    }) 
    try{
        const u1 = await users.save()
        res.status(200).send("User added")
    } catch (err){
        res.send('Error ' + err)
    }
})

router.patch('/blockUser/:id', async(req ,res) =>{
    try{
        const users = await Users.findById(req.params.id)
        if(users.blockstatus == true){
            users.blockstatus = "false"
            res.send("user unblocked")
        } else {
                users.blockstatus = "true"
                res.send("user blocked")
        }
        const u1 = await users.save()
    }catch(err){
        res.json('Erron' + err)
    }
})

router.delete('/delete/:id', async(req ,res) =>{
    try{
        const users = await Users.findById(req.params.id)
        users.blockstatus = req.body.blockstatus
        const u1 = await users.remove()
        res.send("User deleted")
    }catch(err){
        res.json('Erron' + err)
    }
})

module.exports = router