
import Bookings from "../models/Bookings.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';

//endpoint1 get
export const getAllUsers = async (req, res, next) => {
    let users;
    try {
        // in the bracket we need to pass query, no query means it will get all the users
        users = await User.find()
    } catch (err) {
        next(err);
    }

    if (!users) {
        res.status(500).json({ message: "Unexpected Error Occured" });
    }
    res.status(200).json({ users });
};

//endpoint2 post
export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    //validation checks
    if (
        !name || name.trim() === "" &&
        !email || email.trim === "" &&
        !password || password.trim === "") {
        res.status(422).json({ message: "Invalid Inputs" })
    }

    const hashedPasword = bcrypt.hashSync(password);

    //if we pass the validation, we can now create a new user
    let user;
    try {
        user = new User({ name, email, password: hashedPasword });
        user = await user.save()
    }
    catch (err) {
        next(err)
    }
    if (!user) {
        return res.status(500).json({ message: "Unexpected Error Occured" });
    }
    res.status(201).json(user);
};

//endpoint3 put
export const updateUser = async(req,res,next)=>{
    const id =req.params.id;
    const { name, email, password } = req.body;

    //validation checks
    if (
        !name || name.trim() === "" &&
        !email || email.trim === "" &&
        !password || password.trim === "") {
        res.status(422).json({ message: "Invalid Inputs" })
    }

    const hashedPassword = bcrypt.hashSync(password);
    let user;
    try{
        user = await User.findByIdAndUpdate(id, {
            name,
            email,
            password: hashedPassword,
        });
    }
    catch(err){
        next(err)
    }
    if (!user) {
        return res.status(500).json({ message: "Something went wrong" });
    }
    res.status(200).json({message: "updated Succesfully"});

}

//endpoint4, delete
export const deleteUser = async(req,res)=>{
    const id = req.params.id;
    try {
      const result = await User.deleteOne({ _id: id });
      if (result.deletedCount === 1) {
        res.status(200).send({ msg: "Deleted successfully." });
      } else {
        res
          .status(204)
          .send({ msg: "User not found or not deleted." });
      }
    } catch (err) {
      res.status(400).send("Error While Deleting the user", err.message);
      console.log(err);
    }
}

//endpoint5, login/post
export const login =async (req,res,next)=>{
    const { email, password } = req.body;

    //validation checks
    if (
        !email || email.trim === "" &&
        !password || password.trim === "") {
        res.status(422).json({ message: "Invalid Inputs" })
    }
    let existingUser;
    try{
        existingUser =await User.findOne({email})
    }
    catch(err){
        return console.log(err);
    }
    const isPasswordCorrect=bcrypt.compareSync(password, existingUser.password )
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Incorrect password"})
    }
    return res.status(200).json({message: "Login Succesfull"})
}

export const getBookingsOfUsers= async(req,res,next)=>{
    const id=req.params.id;
    let bookings;
    try{
        bookings = await Bookings.find({user: id})
    }catch(err){
        next(err)
    }
    if(!bookings){
        res.status(500).json({message: "No booking found"})
    }
    res.status(200).json({bookings});
}