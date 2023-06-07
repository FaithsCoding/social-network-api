//dependencies
const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");

const app = express();
//defining port number
const PORT = process.env.PORT || 3001;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

//connecting to db and console logging a success message
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
});
