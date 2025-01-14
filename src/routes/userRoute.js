
const express = require('express')

const{userAuth} = require('../middlewares/auth')

const User = require('../models/user')

const connectionRequestModel = require('../models/connectionRequests')

const userRouter = express.Router()

userRouter.get('/user/requests',userAuth,async(requestAnimationFrame,res)=>{
try{

    const loggedUser = requestAnimationFrame.user[0]

    

    const requests = await connectionRequestModel.find({
        toUserId:loggedUser._id,
        status:"Interested",
    }).populate("fromUserId","userName email age gender about imageUrl" )

    if(!loggedUser){
        return res.status(400).send("Connections Not Found!!!!")
    }

    if(requests.length===0){
      return res.send("No Connetcions Found!!!!")
    }

    res.json({message:`${loggedUser.userName} has ${requests.length} Requests`, requests})

}catch(err){
    res.status(400).send("Error" + " "+ err.message)
}
})

userRouter.get('/user/connections',userAuth,async(req,res)=>{
    try{
      const loggedUser = req.user[0]
      const connections = await connectionRequestModel.find({
        $or:[
            {toUserId:loggedUser._id,status:"Accepted"},
            {fromUserId:loggedUser._id,status:"Accepted"}]
      }).populate("fromUserId","userName email age gender about imageUrl").populate("toUserId","userName email age gender about imageUrl")

      const data = connections.map(row=>{
        if(loggedUser._id.toString()===row.fromUserId._id.toString()){
            return row.toUserId
        }
        return row.fromUserId
      })
      
      res.json({
        message: `${loggedUser.userName} has ${connections.length} Connections`,
        data,
      });

    }catch(err){
        res.status(400).send("Error"+" "+err.message)
    }
})

userRouter.get('/user/feed',userAuth,async(req,res)=>{
    try{
         const  page  = parseInt(req.query.page) || 1;

         let  limit  = parseInt(req.query.limit) || 10;

         limit = limit > 50 ? 50 : limit;

         const skip = (page - 1) * limit;
        
         const loggedUser = req.user[0]

        const connectionRequests = await connectionRequestModel.find({
          $or: [{ fromUserId: loggedUser._id}, {toUserId: loggedUser._id }],
        }).select("fromUserId toUserId")

        console.log(connectionRequests)

        

        const feedUniqueConnections = new Set()

        connectionRequests.forEach(user=>{
            feedUniqueConnections.add(user.fromUserId.toString())
            feedUniqueConnections.add(user.toUserId.toString())
        })
       
        //console.log(feedUniqueConnections)

        const feedData = await User.find({
          $and: [
            { _id: { $nin: Array.from(feedUniqueConnections) } },
            { _id: { $ne: loggedUser._id } },
          ],
        }).select("userName email age gender about imageUrl ")
          .skip(skip)
          .limit(limit);

        res.send(feedData)

    }catch(err){
        res.status(400).send("Error :" + err.message)
    }
})

module.exports = userRouter