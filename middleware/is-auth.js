const jwt = require('jsonwebtoken');
const config = require('../config')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        res.status(500).json({
            Error: 'Auth failed',
            operation: 'unsuccessful'
        })
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, config.SECRET_KEY);
    }
    catch(e){
        e.statusCode = 500;
        console.error(e);
    }
    if(!decodedToken){
        res.status(500).json({
            Error: 'Auth failed',
            operation: 'unsuccessful'
        })
    }
    req.loggedInUserId = decodedToken.userId;
    next();
}