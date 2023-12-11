import Bookings from "../models/Bookings.js";

export const newBooking=async(req,res,next)=>{
    const {movie, date, seatNumber, user}= req.body;

    let booking;
    try{
        booking= new Bookings({
            movie,
            date:new Date(`${date}`),
            seatNumber,
            user,
        });
        booking =await booking.save();
    }catch(err){
        console.log(err);
    }
    if(!booking){
        res.status(500).json({message:"unable to create booking"})
    }
    res.status(201).json(booking)
}