const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../../config/secrets')

module.exports = (user) => {
    const payload = {
        subject: user.user_id,
        username: user.username
    }
    const options = {
        expiresIn: '1h'
    }
    const token = jwt.sign(payload, jwtSecret, options)   
    return token 
}