const express = require('express');
const dotenv = require('dotenv');
const cookieParser=require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize=require('@exortek/express-mongo-sanitize');
const helmet=require('helmet');
const {xss} = require('express-xss-sanitizer');
const rateLimit = require('express-rate-limit');
const limiter=rateLimit({
    windowsMs: 10*60*1000,
    max: 100
});
const hpp = require('hpp');
const cors=require('cors');



dotenv.config({path:'./config/config.env'});

connectDB();

const app=express();
app.use(express.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());
app.use(cors());

app.use(cookieParser());
app.set('query parser', 'extended');



const hotels = require(`./routes/hotels`);
const auth = require('./routes/auth');
const appointments = require('./routes/appointments');

app.use('/api/v1/hotels', hotels);
app.use('/api/v1/auth', auth);
app.use('/api/v1/appointments',appointments);

const PORT=process.env.PORT || 5000;

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1));
});