'use strict';

const express  = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');
const mongoDBSessionStore = require('connect-mongodb-session')(session);

//sets view engine ejs
// app.set('view engine', 'ejs');
// app.set('views', 'views');

//logging and monitoring using morgan
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

//parsing req objects using body parser
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//set public dir for serving static files
app.use(express.static(path.join(__dirname, 'public')));

//enable cross origin requests
app.use(cors());

const sessionStore = new mongoDBSessionStore({
    uri: config.MONGODB_URI,
    collection: 'sessions'
});
app.use(session({secret: 'notes portal ipu bhavayAnand9 nodejs  ', resave: false, saveUninitialized: false, store: sessionStore}));

//session and cookies, dealing with it later
// app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

//import User model
const User = require('./model/Users');

//require routes here
const userRoutes = require('./routes/user');
const noteData = require('./routes/notes');

//use routes here
app.use('/user', userRoutes);
app.use('/notes', noteData.routes);

// error handler
const errorController = require('./controllers/errorController')
app.use(errorController.get404);



mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useCreateIndex:true })
    .then(result => {
        console.log('Mongoose connected');
        
        // User.findOne().then(user => {
        //     if(!user){
        //         const user = new User({
        //             name: 'bhavay',
        //             email: 'bhavayanand9@gmail.com',
        //             password: 'my computer',
        //             joiningDate: new Date(),
        //             college: 'ASET',
        //             about: 'fucking idiot',
        //             notesUploaded: {
        //                 notes: []
        //             }
        //         });
        //         user.save()
        //             .then(userCreated => {
        //                 console.log('User created: ', userCreated);
        //             })
        //             .catch(err => {
        //                 console.log('User not created, error in mongoose.connect => then => user.save => catched')
        //             })
        //     }
        // })
        
        app.listen(config.PORT, (err)=>{
            if(err) throw err;
            else console.log(`Server listening to requests on PORT ${config.PORT}`)
        });
    })
    .catch(err => {
        throw err;
    });

//listen for requests on port defined in config file
