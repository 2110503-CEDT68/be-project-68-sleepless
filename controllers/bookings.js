const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');

exports.getBookings=async (req,res,next)=>{
    let query;
    if(req.user.role !== 'admin'){
        query = Booking.find({user:req.user.id}).populate({
            path:'hotel',
            select:'name province tel'
        });
    }else {
        if(req.params.hotelId){
            console.log(req.params.hotelId);
            query = Booking.find({hotel:req.params.hotelId}).populate({
                path:"hotel",
                select:"name province tel",
            });
        }else {
            query=Booking.find().populate({
                path:'hotel',
                select:'name province tel'
            });
        }
    }
    try{
        const bookings = await query;
        res.status(200).json({
            success:true,
            count:bookings.length,
            data:bookings
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({success:false, message: "Cannot find Booking"});
    }
};

exports.getBooking = async(req,res,next) => {
    try{
        const booking = await Booking.findById(req.params.id).populate({
            path:'hotels',
            select:'name description tel'
        });

        if(!booking){
            return res.status(404).json({
                success:false,
                message: `No booking with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success:true,
            data: booking
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot find Booking"
        });
    }
};

exports.addBooking = async (req, res, next) => {
    try {
        
        const { checkInDate, checkOutDate } = req.body;


        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({
                success: false,
                message: "Please provide both checkInDate and checkOutDate"
            });
        }


        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const diffTime = checkOut - checkIn;
        const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffNights > 3) {
            return res.status(400).json({
                success: false,
                message: `Booking cannot exceed 3 nights. You requested ${diffNights} nights.`
            });
        }


        req.body.hotel = req.params.hotelId;
        req.body.user = req.user.id;

  
        const hotel = await Hotel.findById(req.params.hotelId);
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: `No hotel with the id of ${req.params.hotelId}`
            });
        }


        const booking = await Booking.create(req.body);

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot create Booking"
        });
    }
};

exports.updateBooking = async (req,res,next)=>{
    try{
        let booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({
                success:false,
                message:`No booking with the id of ${req.params.id}`
            });
        }

        if(booking.user.toString()!==req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is not authorized to update this booking`
            });
        }

        booking= await Booking.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            data: booking
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot update Booking"
        });
    }
};

exports.deleteBooking = async (req,res,next)=>{
    try{
        const booking = await Booking.findById(req.params.id);

        if(!booking){
            return res.status(404).json({
                success:false,
                message:`No booking with the id of ${req.params.id}`
            });
        }

        if(booking.user.toString()!==req.user.id && req.user.role!=='admin'){
            return res.status(401).json({
                success:false,
                message:`User ${req.user.id} is authorized to delete this booking`
            });
        }

        await booking.deleteOne();

        res.status(200).json({
            success:true,
            data: {}
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Cannot delete Booking"
        });
    }
};