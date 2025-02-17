const express = require("express");

const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/database");

const authRouter = require("./routes/authRoute");

const profileRouter = require("./routes/profileRoute");

const requestRouter = require("./routes/requestRoute");

const userRouter = require("./routes/userRoute");

const chatRouter = require("./routes/chatRoute");


const http = require("http")




const cors = require("cors");
const initialiseSocket = require("./utils/socket");

require("dotenv").config();

const app = express();


app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);

const server = http.createServer(app);

initialiseSocket(server)

app.use(express.json());

app.use(cookieParser());

app.use("/", authRouter);

app.use("/", profileRouter);

app.use("/", requestRouter);

app.use("/", userRouter);

app.use("/",chatRouter)

connectDB()
  .then(() => {
    console.log("DataBase Connected Successfully...");
    server.listen(process.env.PORT, () => {
      console.log("Server Started Sucessfully...");
    });
  })
  .catch((err) => {
    console.log("DB not Connected...." + " " + err.message);
  });
