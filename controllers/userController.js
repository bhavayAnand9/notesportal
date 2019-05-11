const User = require('../model/Users');

exports.signupUser = (req, res, next) => {
    const { name, email, password, college, about } = req.body;
    User.findOne({email: email})
        .then(user => {
            if(user){
                res.status(409).json({
                    Error: 'Conflict happened',
                    Message: 'User already exist with the given credentials'
                })
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password,
                    college: college,
                    about: about,
                    joiningDate: new Date(),
                    notesUploaded: {
                        notes: []
                    }
                });
                newUser.save()
                    .then(userCreated => {
                        res.status(200).json({
                            Message: 'User created',
                            operation: 'Successful',
                            newUserInfo: userCreated
                        })
                    })
                    .catch(err => {
                        console.error(err);
                    })
            }        
        })
        .catch(err => {
            res.status(404).json({
                Error: err,
                Message: 'Some error occured while creating user'
            });
        })
}


exports.loginUser = (req, res, next) => {
    User.findById('5cd6b7aaf2de7577b29d088c')
    .then(user => {
        console.log('user found middleware => findById => then');
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save(err => {
            if(err) res.status(500).json({Message: 'Internal server error occured with sessions', operation: 'Unsuccessful'})
            else {
                res.status(200).json({
                    Req_Info: 'POST req --  /user/login -- ',
                    userLoggedInInfo: user
                });
            }
        })
    })
    .catch(err => {
        console.log('user not found middleware => findById => catched');
        res.status(404).json({
            Comment: 'No such user found',
            Error: err,
            operation: 'unsuccessful'
        })
    })
}

exports.logoutUser = (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            res.status(404).json({
                Error: err,
                Message: 'Some error occured while logging you out.'
            })
        } else {
            res.status(200).json({
                Message: 'User successfully logged out',
                operation: 'Successful'
            })
        }
    })
}