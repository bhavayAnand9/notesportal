const jwt = require('jsonwebtoken');
const config = require('../config')

// module.exports = (req, res, next) => {
//     if(!req.session.isLoggedIn){
//         return res.status(404).json({
//             Error: 'Please login first on /user/login',
//             operation: 'Unsuccessful'
//         })
//     }
//     next();
// }

module.exports = (req, res, next) => {
    try{
        const token = req.get('Authorization').split(' ')[1];
    } catch(e){
        res.status(500).json({
            Error: 'Auth failed',
            operation: 'unsuccessful'
        })
    }
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