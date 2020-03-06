const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');
const staffs = require('./router/staff');

const app = express();

app.use(express.json()); // body parser

dotenv.config({ path: './config/config.env' }); //load env

if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
} // dev logging middleware

connectDB();

app.use('/api/v1/staff', staffs); //mount route
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(
    PORT,
    console.log(
        `Server run in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
);

process.on('unhandleRejectio', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
}); // handle unhandle promise reject
