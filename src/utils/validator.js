const validator = require('validator')

const validateUserData = (req)=>{
    //console.log(req)
    const {userName,password,email} = req.body
    console.log(userName)
    if(userName.length===0){
        throw new Error("Enter a valid username")
    }
     if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a strong password ")
    } if(!validator.isEmail(email)){
        throw new Error("Enter a valid Email")
    }
}

module.exports = {validateUserData};