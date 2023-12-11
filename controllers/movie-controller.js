import Movie from "../models/Movie.js";
import jwt from "jsonwebtoken";

export const addMovie = async(req,res,next)=>{
    const extractedToken = req.headers.authorization.split(" ")[1];
    if(!extractedToken && extractedToken.trim()===""){
        return res.status(404).json({message: "Token not found"})
    }
    // console.log(extractedToken);
    let adminId;

    //verify token
    jwt.verify(extractedToken, process.env.SECRET_KEY,(err, decrypted)=>{
        if(err){
            return res.status(400).json({ message: err.message})
        }else{
            adminId = decrypted.id;
            return;
        }
    })


    //create new movie
    const {title, description, releaseDate, posterUrl, featured, actors}=req.body;
    if(!title && title.trim()==="" && !description && description.trim==="" ){
        return res.status(422).json({message: "Invalid Inputs"})
    }

    let movie;
    try{
        movie = new Movie({
            title, 
            description, 
            releaseDate: new Date(`${releaseDate}`), 
            posterUrl,
            featured, 
            actors,
            admin: adminId 
        });
        movie = await Movie.save();

    }catch(err){
        console.log(err);
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
    return res.status(200).json(movies)
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
    res.status(200).json(movie);
};