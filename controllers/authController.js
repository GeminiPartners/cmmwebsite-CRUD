const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const JWT_SECRET = process.env.JWT_SECRET;
console.log('secret: ',JWT_SECRET);
const router = express.Router();
var Shared = require('../shared')

const User = require('../models/userModel')





function setUserIdCookie(req, res, id) {
    const isSecure = req.app.get('env') !='development';
    res.cookie('user_id', id, {
        httpOnly: true,
        secure: isSecure,
        signed: true
    });
};

function setUserIdToken(req, res, token) {
    const isSecure = req.app.get('env') !='development';
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: isSecure,
        signed: true
    });
}


// Users can login to the app wiwth valid email/password
// Users cannot login to the app with a blank or missing email
// Users cannot login to the app with a blank or incorrect password

function validUser(user) {
    const validEmail = typeof user.email == 'string' &&
                        user.email.trim() != '';
    const validPassword = typeof user.password == 'string' &&
                        user.password.trim() != '' &&
                        user.password.trim().length >= 6; 
    const validUsername = typeof user.username == 'string' &&
                        user.username.trim() != '';
    return validEmail && validPassword && validUsername
};

function validLogin(user) {
    console.log(user)
    const validEmail = typeof user.email == 'string' &&
                        user.email.trim() != '';
    const validPassword = typeof user.password == 'string' &&
                        user.password.trim() != '' &&
                        user.password.trim().length >= 6; 
    return validEmail && validPassword 
}

exports.viewSignup = function(req, res) {
    res.render('signup');
};

exports.postSignup = function(req, res, next)  {
    console.log('sign up: ', req.body)
    if(validUser(req.body)) {
        Shared.allowOrigin(res, req);
        User
            .getOneByEmail(req.body.email)
            .then(user => {
                console.log('user', user);
                if(!user) {
                    // this is a unique email
                    // hash password
                    bcrypt.hash(req.body.password, 10)
                        .then((hash) => {
                    // insert user into db
                    const user = {
                        email: req.body.email,
                        username: req.body.username,
                        location: req.body.location,
                        instructions_default: req.body.instructions_default,
                        password: hash,
                        created_at: new Date()
                    };

                    User
                        .create(user)
                        .then(id => {
                            if (req.headers.req_type="gmAPI") {
                                res.json({
                                    id,
                                    message: 'post'
                                    });
                            } else {
                                res.render('signup')
                            }
                            
                            
                        });
                        res.clearCookie('auth_token');
                    // redirect
                    });
                } else {
                    //email in use
                    next(new Error('Email in use'));
                }

            });

    } else {
        next(new Error('Invalid user'))
    }

};

router.post('/login', (req, res, next) => {
    Shared.allowOrigin(res, req);
    console.log('whats happing?')
    if(validLogin(req.body)) {
        console.log(req.body);
        User
            .getOneByEmail(req.body.email)
            .then(user => {
                if(user) {
                    bcrypt
                        .compare(req.body.password, user.password)
                        .then((result) => {
                            // If the passwords matched
                            if(result) {
                                // setting the 'set-cookie header
                                res.clearCookie('auth_token');
                                const token = jwt.encode(
                                    {
                                    'user_id': user.id,
                                    'is_active': user.is_active
                                    },
                                    JWT_SECRET);
                                // setUserIdCookie(req, res, user.id);                                
                                const isSecure = req.app.get('env') !='development';
                                res.cookie('user_id', user.id, {
                                    httpOnly: true,
                                    secure: isSecure,
                                    signed: true
                                });

                                // setUserIdToken(req, res, token); 
                                res.cookie('auth_token', token, {
                                    httpOnly: true,
                                    secure: isSecure,
                                    signed: true
                                });


                                res.json({
                                    id: user.id,
                                    message: 'Logged in!',
                                    'token': token
                                });
                                
                            } else {
                                next(new Error('Invalid login3'));
                            }
                        });
                } else {
                    next(new Error('Invalid login1'));
                }               
            });
    } else {
        next(new Error('Invalid login2'))
    }
});

router.get('/login', (req, res, next) => {
    Shared.allowOrigin(res, req);
    if(validLogin(req.body)) {
        console.log(req.body);
        User
            .getOneByEmail(req.body.email)
            .then(user => {
                if(user) {
                    bcrypt
                        .compare(req.body.password, user.password)
                        .then((result) => {
                            // If the passwords matched
                            if(result) {
                                // setting the 'set-cookie header
                                const token = jwt.encode(
                                    {
                                    'user_id': user.id,
                                    'is_active': user.is_active
                                    },
                                    JWT_SECRET);
                                // setUserIdCookie(req, res, user.id);                                
                                const isSecure = req.app.get('env') !='development';
                                res.cookie('user_id', user.id, {
                                    httpOnly: true,
                                    secure: isSecure,
                                    signed: true
                                });

                                // setUserIdToken(req, res, token); 
                                res.cookie('auth_token', token, {
                                    httpOnly: true,
                                    secure: isSecure,
                                    signed: true
                                });


                                res.json({
                                    id: user.id,
                                    message: 'Logged in!',
                                    'token': token
                                });
                                
                            } else {
                                next(new Error('Invalid login3'));
                            }
                        });
                } else {
                    next(new Error('Invalid login1'));
                }               
            });
    } else {
        next(new Error('Invalid login2'))
    }
});


