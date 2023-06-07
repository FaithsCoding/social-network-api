const mongoose = require("mongoose");

//using false will keep my code compatible with mongoose 7.
//using false means any undefined fields will be ignored and no error thrown.
//this is more compatible with mongoose's own query langauge
//mongoose.set("strictQuery", false);

//i will use true for development so errors appear and i can debug where needed.
mongoose.set("strictQuery", true);

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/social-network",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//enables debug mode for Mongoose, which outputs additional information about the database operations to the console. This can be useful for debugging purposes.
mongoose.set("debug", true);

module.exports = mongoose.connection;
