import mongoose, { Schema } from "mongoose";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    email : {
        type : String,
        required : true,
        unique : true
    }, 
    fullname : {
        type : String,
        required : true,
        index : true
    },
    avatar : {
        type : String,
        default : ""
    },
    password : {
        type : String,
        required : true,
        minlenght : 6
    }
}, { timestamps: true })

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password =  await bcryptjs.hash(this.password, 10)
    next()
})


userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcryptjs.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign( 
        {
            _id : this._id,
            email : this.email,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
       
    )
}


export const User = mongoose.model("User", userSchema) 