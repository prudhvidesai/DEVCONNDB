const socket = require("socket.io")
const Chat = require("../models/chat")


const initialiseSocket = (server)=>{

const io = socket(server,{
    cors:{origin:"http://localhost:5174"}
})

io.on("connection",(socket)=>{
    socket.on("joinChat",({name,userId,targetId})=>{
        const roomId = [userId,targetId].sort().join("_")
        console.log(name+" "+"Joinined Room" +" "+ roomId)
        socket.join(roomId)
    })

    socket.on("sendMessage", async({ name, userId, targetId, text }) => {
      
        try{
              const roomId = [userId, targetId].sort().join("_");
              console.log(name + " " + text);
              io.to(roomId).emit("receivedMessage", { name, text });
               
           let chat = await Chat.findOne({
            participants:{$all:[userId, targetId]}
        })
           if(!chat){
            chat = new Chat({
                participants:[userId,targetId],
                messages:[]
            })
           }
           chat.messages.push(
            {
            senderId:userId,
            text,
           }
        )
           await chat.save()
        }catch(err){
            console.log(err)
        }
        
    });

})
}

module.exports= initialiseSocket