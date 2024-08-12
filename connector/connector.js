import mongoose from "mongoose";

const dbConnection = async () => {
  return mongoose.connect(`mongodb+srv://ankushrana9458:${process.env.MONGODB_PWD}@cluster0.38osesy.mongodb.net/?retryWrites=true&w=majority`, () => {
    console.log("DB Connceted");
  });
};
export default dbConnection;