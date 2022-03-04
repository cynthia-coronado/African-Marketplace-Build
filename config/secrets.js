const jwt = require('jsonwebtoken')
const jwtSecret = process.env.jwtSecret || 'SHHHH'

function tokenMaker(user){
    const payload = {
        subject: user.user_id,
        username: user.username
    }
    const options = {
        expiresIn : '8h'
    }
    const token = jwt.sign(payload,jwtSecret,options)
    return token
}
module.exports = {
    tokenMaker,
    jwtSecret
}
