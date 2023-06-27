const mongoose = require('mongoose')
const validator = require('validator')

const userVerifiedSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,validate:(value)=>validator.isEmail(value)},
    password:{type:String,required:true},
    verifiedCode:{type:String},
    verified:{type:Boolean,default:false},
    createdAt:{type:Date, default:Date.now()}
},
{
    collection:'verifiedUser',
    versionKey:false
}
)

const verifiedUserModel = mongoose.model('userVerified',userVerifiedSchema)
module.exports = {verifiedUserModel}

