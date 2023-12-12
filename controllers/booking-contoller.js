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
    res.status(201).json({booking})
}
export const getBookingById = async(req,res,next)=>{
    const id =req.params.id;
    let booking;
    try{
        booking =await Bookings.findById(id);
    }catch(err){
        next(err)
    }
    if(!booking){
        res.status(500).json({message : "no booking found"})
    }
    res.status(200).json({booking});
}

export const getBooking = async (req, res, next) => {
    let bookings;
    try {
      bookings = await Bookings.find();
    } catch (err) {
      return console.log(err);
    }
    if (!bookings) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(200).json({ bookings });
  };

  export const deleteBooking = async(req,res,next)=>{
    const id =req.params.id;
    let booking;
    try{
        booking= await Bookings.findByIdAndDelete(id).populate("user movie");
        const session = await mongoose.startSession();
        session.startTransaction();
        await booking.user.bookings.pull(booking);
        await booking.movie.bookings.pull(booking);
        await booking.movie.save({session});
        await booking.user.save({session});
        session.commitTransation();

    }catch(err){
        next(err)
    }
    if (!booking) {
        return res.status(500).json({ message: "No booking found by this id" });
      }
      return res.status(200).json({ message: "Successfully Deleted" });
  }