import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/?replicaSet=rs0");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error on connecting with database: " + err);
  }
};

export { connect };
