const express = require('express')
const { userAuth } = require('../middlewares/auth')
const Chat = require('../models/chat')

const chatRouter = express.Router()

chatRouter.get("/chat/:targetId",userAuth,async(req,res)=>{
   try{
     //console.log(req.user)
     const userId = req.user[0]._id;
     //console.log(userId)
     const {targetId} = req.params;

     //console.log(targetId)

     let chat = await Chat.findOne({
       participants: { $all: [userId, targetId] },
     }).populate({path:"messages.senderId", select:"userName"});
     console.log(chat)
     if (!chat) {
       chat = new Chat({
         particpants: [userId, targetId],
         messages: [],
       });
     }
     await chat.save();
     res.json(chat)

   }catch(err){
    console.log(err)
   }
   

})


module.exports=chatRouter