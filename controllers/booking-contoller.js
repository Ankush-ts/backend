import Bookings from "../models/Bookings.js";
import Movie from "../models/Movie.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const newBooking=async(req,res,next)=>{
    const {movie, date, seatNumber, user}= req.body;

    let existingMovie;
    let existingUser;
    try{
        existingMovie = await Movie.findById(movie);
        existingUser = await User.findById(user);
    }catch(err){
        next(err)
    }
    if(!existingMovie){
        throw new Error("Movie not found")
    }
    if(!existingUser){
        throw new Error("user not found with the given Id")
    }
    let booking;
    try{
        booking= new Bookings({
            movie,
            date:new Date(`${date}`),
            seatNumber,
            user,
        });

        const session = await mongoose.startSession();
        session.startTransaction();
        existingUser.bookings.push(booking);
        existingMovie.bookings.push(booking);
        await existingUser.save({session});
        await existingMovie.save({session});
        await booking.save({session});
        session.commitTransaction();

    
    }catch(err){
        console.log(err);
    }
    if(!booking){
        res.status(500).json({message:"unable to create booking"})
    }
    res.status(201).json(booking)
}