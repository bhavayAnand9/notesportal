exports.loginUser = (req, res) => {
    // req.isLoggedIn = true;
    res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly')
    res.status(200).json({
        Req_Info: 'POST req --  /user/login -- ',
    });
}

exports.signupUser = (req, res) => {
    res.status(200).json({
        Req_Info: 'POST req -- /user/signup -- '
    });
}