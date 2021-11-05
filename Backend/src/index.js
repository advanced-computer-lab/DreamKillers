//Importing needed libraries
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
require("dotenv").config();

//Application Variables
const app = express();
app.use(cors());
const port = config.get("server.port");

const userRouter = require("./Routes/user.route");
const flightRouter = require("./Routes/flights.route");
const adminRouter = require("./Routes/admin.route");

//DB Connection
mongoose
  .connect(process.env.mongouri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("MongoDB is now connected"))
  .catch((err) => console.log(err));

app.use(express.json());

//Routing
app.use("/user", userRouter);
app.use("/flights", flightRouter);
app.use("/admin", adminRouter);

//Host app on localhost
app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});
