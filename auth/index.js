const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const JWT_SECRET = "kittens"; //change to environment variable
const router = express.Router();

const User = require('../db/user')

router.get('/', (req, res) => {
    res.json({
        message: 'success'
    })
})

// Users can login to the app wiwth valid email/password
// Users cannot login to the app with a blank or missing email
// Users cannot login to the app with a blank or incorrect password

function validUser(user) {
    const validEmail = typeof user.email == 'string' &&
                        user.email.trim() != '';
    const validPassword = typeof user.password == 'string' &&
                        user.password.trim() != '' &&
                        user.password.trim().length >= 6; 
    return validEmail && validPassword
}

router.post('/signup', (req, res, next) => {
    if(validUser(req.body)) {
        res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
        res.set('Access-Control-Allow-Credentials', 'true');
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
                            res.json({
                                id,
                                message: 'post'
                                });
                        })
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

});

router.post('/login', (req, res, next) => {
    if(validUser(req.body)) {
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
                                res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:8080');
                                res.set('Access-Control-Allow-Credentials', 'true');
                                const isSecure = req.app.get('env') !='development';
                                res.cookie('user_id', user.id, {
                                    httpOnly: true,
                                    secure: isSecure,
                                    signed: true
                                });
                                const token = jwt.encode(
                                    {
                                    'user_id': user.id,
                                    'is_active': user.is_active
                                    },
                                    JWT_SECRET);
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

module.exports = router;