const mongoose = require('mongoose')


const connectDB = async()=>{
    await mongoose.connect(
      
        "mongodb+srv://prudhvimaheshd:X5TNbDhUU65aVokq@namastenode.sto51.mongodb.net/DevtinderRev"
    );

}

module.exports = {connectDB}