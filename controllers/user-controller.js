
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
        return res.status(500).json({ message: "Unexpected Error Occured" });
    }
     return res.status(200).json({ users });
};

//endpoint2 post
export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    //validation checks
    if (
        !name || name.trim() === "" &&
        !email || email.trim === "" &&
        !password || password.trim === "") {
        return res.status(422).json({ message: "Invalid Inputs" })
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
    return res.status(201).json({id: user._id});
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
        return res.status(422).json({ message: "Invalid Inputs" })
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
   return res.status(200).json({message: "updated Succesfully"});

}

//endpoint4, delete
export const deleteUser = async (req, res, next) => {
    const id = req.params.id;
    let user;
    try {
      user = await User.findByIdAndRemove(id);
    } catch (err) {
      next(err);
    }
    if (!user) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json({ message: "Deleted Successfully" });
  };

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
        next(err);
    }
    if (!existingUser) {
        return res
          .status(404)
          .json({ message: "Unable to find user from this ID" });
      }
    const isPasswordCorrect=bcrypt.compareSync(password, existingUser.password )
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Incorrect password"})
    }
    return res.status(200).json({message: "Login Succesfull", id: existingUser._id})
}

export const getBookingsOfUser = async (req, res, next) => {
    const id = req.params.id;
    let bookings;
    try {
      bookings = await Bookings.find({ user: id })
        .populate("movie")
        .populate("user");
    } catch (err) {
      return console.log(err);
    }
    if (!bookings) {
      return res.status(500).json({ message: "Unable to get Bookings" });
    }
    return res.status(200).json({ bookings });
  };

  
  export const getUserById = async (req, res, next) => {
    const id = req.params.id;
    let user;
    try {
      user = await User.findById(id);
    } catch (err) {
      return console.log(err);
    }
    if (!user) {
      return res.status(500).json({ message: "Unexpected Error Occured" });
    }
    return res.status(200).json({ user });
  };