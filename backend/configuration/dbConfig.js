const mongoose = require("mongoose");


const mongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to MongoDB");
      } catch (err) {
        console.error("Error connecting to MongoDB:", err);
      }
};

module.exports = mongo;