const User = require('../models/user')

const jwt = require('jsonwebtoken')

const userAuth = async(req,res,next)=>{

    try{

        const {token} = req.cookies
        if(!token){
            return res.status(401).send("Please Login To Continue...")
        }
            const decodedToken = jwt.verify(token,"DEV@TINDER@REV@2024")
            const user = await User.find({_id:decodedToken.userId})

            if(!user){
                throw new Error("user not found...")
            }
            req.user=user
            next()
        }

    catch(err){
        res.status(400).send("Error" + " " + err.message)
    }

}

module.exports = {userAuth}