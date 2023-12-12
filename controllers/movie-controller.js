import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Movie from "../models/Movie.js";




export const addMovie = async(req,res,next)=>{
    const extractedToken = req.headers.authorization.split(" ")[1];
    if(!extractedToken || extractedToken.trim()===""){
        throw new Error('Token not found');
    }
    // console.log(extractedToken);
    let adminId;

    //verify token
    jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted)=>{
        if(err){
            return res.status(400).json({ message: `${err.message}`})
        }else{
            adminId = decrypted.id;
            return;
        }
    })


    //create new movie
    const {title, description, releaseDate, posterUrl, featured, actors}=req.body;
    if(!title || title.trim()==="" && 
    !description || description.trim()==="" &&
    !posterUrl || posterUrl.trim()==="" 
    )
    {
        throw new ValidationError('Invalid Inputs');
    }

    let movie;
    // new movie instance created
    try{
        movie = new Movie({
            title, 
            description, 
            releaseDate: new Date(`${releaseDate}`), 
            posterUrl,
            featured, 
            actors,
            admin: adminId,
        });

        //await movie.save();
        //session for movie storing
        const session = await mongoose.startSession();
        const adminUser = await Admin.findById(adminId);
        //we start a transaction, in which single transaction these records will be saved
        session.startTransaction();
        //first we save the movie
        await movie.save({session});
        // console.log(movie);
        adminUser.addedMovies.push(movie);
        //then we save the admin user as well
        await adminUser.save({session});
        await session.commitTransaction();
    }catch(err){
        next(err);
    }
    if(!movie){
        return res.status(500).json({message:"Request Failed"})
    }
    return res.status(201).json({movie});
};

export const getAllMovies = async(req,res,next)=>{
    let movies;
    try{
        movies = await Movie.find();
    }catch(err){
        console.log(err);
    }

    if(!movies){
        res.status(500).json({message: "Request Failed"})
    }
    return res.status(200).json({movies})
};

export const getMovieById = async(req,res,next)=>{
    const id = req.params.id;
    let movie;
    try{
        movie = await Movie.findById(id);
    }catch(err){
        console.log(err);
    }
    if(!movie){
        res.status(404).json({message:"Invalid Movie"});
    }
    res.status(200).json({movie});
};