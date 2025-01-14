
const mongoose = require('mongoose')

const connectionRequestSchema = mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    status:{
        type:String,
        enum:{
            values:['Ignored','Interested','Accepted','Rejected'],
            message:`{VALUE} is not a valid status`
        }
    }

},{timeStamp:true})


connectionRequestSchema.pre ("save",function(next){
const connectionRequest = this
if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send request to Yourself!!!")
}
next()
})

const connectionRequestModel = mongoose.model(
  'connectionRequestModel',
  connectionRequestSchema
);

module.exports = connectionRequestModel