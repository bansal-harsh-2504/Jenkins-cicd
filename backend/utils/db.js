import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database successfully.");
  } catch (err) {
    console.log(err);
  }
};
export default connectToMongoDB;
