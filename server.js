const path = require('path');
const dotenv = require('dotenv');
const colors = require('colors');
const cookieParser = require('cookie-parser');

const express = require('express');
const fileupload = require('express-fileupload');
const morgan = require('morgan');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

const profiles = require('./router/profile');
const category = require('./router/category');
const post = require('./router/post');
const auth = require('./router/auth');

const app = express();

// body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//load env
dotenv.config({ path: './config/config.env' });

// dev logging middleware
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}

//connect databASE
connectDB();

//use upload
app.use(fileupload());

//static route
app.use(express.static(path.join(__dirname, 'public')));

//mount route
app.use('/api/v1/profile', profiles);
app.use('/api/v1/category', category);
app.use('/api/v1/post', post);
app.use('/api/v1/auth', auth);

//handle error
app.use(errorHandler);

//use port
const PORT = process.env.PORT || 8000;

//run server
const server = app.listen(
    PORT,
    console.log(`Server run in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// handle unhandle promise reject
process.on('unhandleRejectio', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});
