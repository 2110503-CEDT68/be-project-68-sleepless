const mongoose = require('mongoose');
const { checkout } = require('../routes/bookings');

const BookingSchema=new mongoose.Schema({
    checkinDate: {
        type:Date,
        required:true
    },
    checkoutDate:{
        type:Date,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    hotel:{
        type:mongoose.Schema.ObjectId,
        ref:'Hotel',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Booking',BookingSchema);