const path = require('path');
const dotenv = require('dotenv');

const express = require('express');
const fileupload = require('express-fileupload');
const morgan = require('morgan');
const colors = require('colors');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

const staffs = require('./router/staff');
const category = require('./router/category');
const post = require('./router/post');
const auth = require('./router/auth');

const app = express();

app.use(express.json()); // body parser

dotenv.config({ path: './config/config.env' }); //load env

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
} // dev logging middleware

connectDB();

app.use(fileupload());

//static route
app.use(express.static(path.join(__dirname, 'public')));

//mount route
app.use('/api/v1/staff', staffs);
app.use('/api/v1/category', category);
app.use('/api/v1/post', post);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(
    PORT,
    console.log(`Server run in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

process.on('unhandleRejectio', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
}); // handle unhandle promise reject
