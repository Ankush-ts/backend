import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const addAdmin =async (req,res,next)=>{
    const{email, password}=req.body;

    if (
    
        !email || email.trim === "" &&
        !password || password.trim === "") {
        res.status(422).json({ message: "Invalid Inputs" })
    }

    let existingAdmin;
    try{
        existingAdmin=await Admin.findOne({email});
    }catch(err){
        return console.log(err);
    }

    if(existingAdmin){
        return res.status(400).json({message: "Admin already exists"})
    }
    let admin;
    const hashedPassword=bcrypt.hashSync(password);
    try{
        admin = new Admin({email, password: hashedPassword});
        admin =await admin.save();
    }catch(err){
        return console.log(err)
    }
    if(!admin){
        return res.status(500).json({message: "unable to save admin"})
    }
    return res.status(201).json({admin})
}

export const adminLogin = async (req, res, next)=>{
    const { email, password } = req.body;

    //validation checks
    if (
        !email || email.trim === "" &&
        !password || password.trim === "") {
        res.status(422).json({ message: "Invalid Inputs" })
    }
    let existingAdmin;
    try{
        existingAdmin =await Admin.findOne({email})
    }
    catch(err){
        return console.log(err);
    }
    if(!existingAdmin){
        return res.status(400).json({message: "No Admin records"})
    }
    const isPasswordCorrect=bcrypt.compareSync(password, existingAdmin.password )
    
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Incorrect password"})
    }
    const token = jwt.sign({id: existingAdmin._id}, process.env.SECRET_KEY,{expiresIn: "1d"})
    return res.status(200).json({message: "Authentication complete", token, id:existingAdmin._id})
}

export const getAdmins = async(req,res,next)=>{
    let admins;
    try{
        admins = await Admin.find()
    }catch(err){
        return console.log(err);
    }

if(!admins){
    return res.status(500).json({message:"Internal server error"})
}
return res.status(200).json(admins)
}