import mongoose from "mongoose";
import envConfig  from "./config";

const connectDB = async () => {
  try { 
    mongoose.connection.on("connected", () => {
      console.log("connected to DB succesfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("error in connecting to DB", err);
      process.exit();
    });

    await mongoose.connect(envConfig.DB_uri as string);
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
};

export default connectDB;
