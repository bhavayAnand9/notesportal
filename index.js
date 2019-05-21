'use strict';

const express  = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config');
const helmet = require('helmet');
// const mongoDBSessionStore = require('connect-mongodb-session')(session);
const session = require('express-session');
const multer = require('multer');

//sets view engine ejs
// app.set('view engine', 'ejs');
// app.set('views', 'views');

//logging and monitoring using morgan
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))

//parsing req objects using body parser
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(multer({dest:"uploads"}).single('document'))

//set public dir for serving static files
app.use(express.static(path.join(__dirname, 'public')));

//enable cross origin requests
app.use(cors());

// const sessionStore = new mongoDBSessionStore({
//     uri: config.MONGODB_URI,
//     collection: 'sessions'
// });
// app.use(session({secret: 'notes portal ipu bhavayAnand9 nodejs  ', resave: false, saveUninitialized: false, store: sessionStore}));

app.use(helmet());

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
        const server = app.listen(config.PORT, (err)=>{
            if(err) throw err;
            else console.log(`Server listening to requests on PORT ${config.PORT}`)
        });
        const io = require('socket.io')(server);
        io.on('connection', socket => {
            console.log('client connected');
            console.log(socket);
        })
    })
    .catch(err => {
        throw err;
    });

module.exports = app;