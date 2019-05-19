module.exports = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.status(404).json({
            Error: 'Please login first on /user/login',
            operation: 'Unsuccessful'
        })
    }
    next();
}