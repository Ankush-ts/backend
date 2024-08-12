import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user-routes.js';
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingRouter from "./routes/booking-routes.js";
import errorHandler from "./errorHandler.js";
import cors from "cors";
import dbConnection from "./connector/connector.js";

dotenv.config();

const app = express();



// async function main() {
//   await mongoose.connect(`mongodb+srv://ankushrana9458:${process.env.MONGODB_PWD}@cluster0.38osesy.mongodb.net/?retryWrites=true&w=majority`);
//   // await mongoose.connect('mongodb://localhost:27017')
//   console.log("database connected");
// }
// main().catch((err) => console.log(err));

//middlewares
app.use(cors());
app.use(express.json());
app.use(errorHandler);
// app.get("/", (req, res) => {
//     res.send('OK')
// })
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/movie", movieRouter);
app.use("/booking", bookingRouter);

// Error handling middleware
// app.use((error,req,res,next)=>{
//     if(error){
//         res.status(500).json({message: + error.message})
//     }
//     next();
// })

// mongoose.connect(`mongodb+srv://ankushrana9458:${process.env.MONGODB_PWD}@cluster0.38osesy.mongodb.net/?retryWrites=true&w=majority`
// )


// app.listen(5000, () => {
//     console.log("connected to database and server running on port 5000")
// });

mongoose
  .connect(
    `mongodb+srv://ankushrana9458:${process.env.MONGODB_PWD}@cluster0.38osesy.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log("Connected To Database And Server is running")
    )
  )
  .catch((e) => console.log(e));
  // app.listen(process.env.PORT, async () => {
  //   try {
  //     await dbConnection();
  //     console.log("Connected to database successfully");
  //   } catch (error) {
  //     console.log("Not connected to database", error);
  //     console.log("Something went wrong while connecting to database");
  //   }
  //   console.log(`server is running at ${process.env.PORT}`);
  // });

