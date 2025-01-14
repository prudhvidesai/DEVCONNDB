const express = require('express')

const User = require('../models/user')

const {userAuth} = require('../middlewares/auth')

const profileRouter = express.Router()

profileRouter.get('/profile',userAuth,(req,res)=>{
    const user = req.user[0]
    res.send(user)
})

profileRouter.patch('/profile/edit',userAuth,async(req,res)=>{
    
    try{
       const loggedUser = req.user[0]
       const updationData = req.body
       console.log(loggedUser)
       console.log(req.body)
    const allowedUpdatations = ['userName','age','gender','about','imageUrl']
    const isValid = Object.keys(updationData).every(key=>allowedUpdatations.includes(key))
    if(!isValid){
       throw new Error("Invalid Update!!!!!")
    }else{
        Object.keys(updationData).forEach(key=>loggedUser[key]=updationData[key])
       const data = await loggedUser.save()
        res.send(data)
    }
    }catch(err){
        res.status(400).send("Error" + ":" + err.message)
    }
    
    
})

module.exports = profileRouter