//Importing needed libraries
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
//Application Variables
const app = express();
const port = config.get("server.port");
const flightSearchRouter = require('./Routes/flightSearch.route');

//DB Connection
mongoose
  .connect(config.get("database.mongouri"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("MongoDB is now connected"))
  .catch((err) => console.log(err));

app.use(express.json());
//search for a flight router
app.use('/search',flightSearchRouter);

//Host app on localhost
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
