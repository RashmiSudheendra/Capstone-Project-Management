const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SALT = 10;
const secret = 'Vkjd@srkgeah@#$R#tefnguihr'

const hashPassword = async(password)=>{
    let salt = await bycrypt.genSalt(SALT)
    let hash = await bycrypt.hash(password,salt)
    return hash
}

const hashCompare = async(password, hashedPassword)=>{
    return bycrypt.compare(password, hashedPassword)
}

const createToken = async(payload)=>{
    let token = await jwt.sign(payload,secret,{expiresIn:'1m'})
    return token
}

const decodeToken = async(req,res,next)=>{
    // console.log(req.rawHeaders[1])
    let token = req.headers.authorization.split(" ")[1]
    let data = await jwt.decode(token);
    req.user_data = data
    // console.log(data)
    return next()
}



module.exports ={hashPassword, hashCompare, createToken, decodeToken}