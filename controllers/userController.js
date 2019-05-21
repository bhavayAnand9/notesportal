const bcrypt = require('bcryptjs');
const User = require('../model/Users');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const config = require('../config');
const jwt = require('jsonwebtoken');

sgMail.setApiKey(config.sendGrid_API_key);


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
                            Message: 'user created',
                            operation: 'successful',
                            newUserInfo: userCreated
                        })

                        const msg = {
                            to: email,
                            from: 'auth-team@notesportal.com',
                            subject: 'Successfully signed up!',
                            text: "Congratulations you're successfully signed up with notesportal"
                            // html: '',
                          };
                        sgMail.send(msg);

                    })
                    .catch(err => res.status(500).json(err));

            }        
        })
        .catch(err => res.status(500).json(err));
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

                    const token = jwt.sign({
                        email: user.email,
                        userId: user._id.toString()
                    }, config.SECRET_KEY, { expiresIn: '1h' });

                    return res.status(200).json({
                        Message: 'User logged in',
                        operation: 'Succesful',
                        token: token,
                        userLoggedInInfo: user
                    })
                }
                else {
                    res.status(404).json({
                        Message: 'Credentials do not match',
                        operation: 'Unsuccessful'
                    })
                }
            })
            .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).json(err));
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

exports.resetPasswordMail = (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err){
            res.status(404).json({err});
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if(!user){
                    return res.status(404).json({
                        error: 'no such account found',
                        operation: 'unsuccessful'
                    })
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                user.save()
                    .then(result => {
                        const msg = {
                            to: req.body.email,
                            from: 'usersupport@notesportal.com',
                            subject: 'Password reset',
                            html: `
                                <p>You requested a password reset</p>
                                <p>click this <a href="http://localhost:5000/reset/${token}">link</a> to set a new password</p>
                            `
                        };
                        sgMail.send(msg);
                        return res.status(200).json({
                            'Message': 'Please check your email for further instructions to reset your password.',
                            'operation': "successful"
                        })
                    })
            })
            .catch(err => {
                // if(err)  res.status(404).json({err});
                if(err)  res.status(500).json(err);
            })
    })
}

exports.updatePassword = (req, res) => {
    const token = req.params.token;
    const newPassword = req.body.password
    User.findOne({resetToken: token})
        .then(user => {
            const hashedPassword = bcrypt.hashSync(newPassword, 12);
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            user.save()
                .then(userUpdated => {
                    return res.status(200).json({
                        Message: 'User password updates',
                        operation: 'Successful'
                    })
                })
            // res.send(user);
        })
        .catch(err => {
            return res.status(404).json({err});
        })
}