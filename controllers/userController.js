const bcrypt = require('bcryptjs');
const User = require('../model/Users');

exports.signupUser = (req, res, next) => {
    const { name, email, password, college, about } = req.body;
    User.findOne({email: email})
        .then(user => {
            if(user){
                return res.status(409).json({
                    Error: 'Conflict happened',
                    Message: 'User already exist with the given credentials'
                })
            } else {
                const hashedPassword = bcrypt.hashSync(password, 12);
                const newUser = new User({
                    name: name,
                    email: email,
                    password: hashedPassword,
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
                    .catch(err => console.error(err));
            }        
        })
        .catch(err => console.log(err));
}

exports.loginUser = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({email: email})
    .then(user => {
        if(!user){
            return res.status(404).json({
                Comment: 'No such user found',
                operation: 'unsuccessful'
            })
        }
        bcrypt.compare(password, user.password)
            .then(doMatch => {
                if(doMatch){
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    req.session.save(err => {
                        if(err) console.error(err);
                        return res.status(200).json({
                            Message: 'User logged in',
                            operation: 'Succesful',
                            userLoggedInInfo: user
                        })
                    })
                }
                else {
                    res.status(404).json({
                        Message: 'Credentials do not match',
                        operation: 'Unsuccessful'
                    })
                }
            })
            .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
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