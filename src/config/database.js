const mongoose = require('mongoose')


const connectDB = async()=>{
    await mongoose.connect(
      "mongodb+srv://prudhvimaheshd:G1XmNjSGVgMmaSJI@namastenode.sto51.mongodb.net/DevtinderRev"
    );

}

module.exports = {connectDB}