const express = require('express')

const cookieParser = require('cookie-parser')

const{connectDB} = require('./config/database')

const authRouter = require('./routes/authRoute')

const profileRouter = require('./routes/profileRoute')

const requestRouter = require('./routes/requestRoute')

const userRouter = require('./routes/userRoute')

const cors = require('cors')

const app = express()

require('dotenv').config()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    
  })
);

app.use(express.json())

app.use(cookieParser())

app.use('/',authRouter)

app.use('/',profileRouter)

app.use('/',requestRouter)

app.use('/',userRouter)


connectDB()
.then(()=>{
    console.log("DataBase Connected Successfully...")
    app.listen(3030, () => {
      console.log("Server Started Sucessfully...");
    });
})
.catch((err)=>{
  console.log("DB not Connected...." + " " + err.message)
})


