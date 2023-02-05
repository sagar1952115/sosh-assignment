const express = require("express");
const dotenv = require("dotenv");
const authRouter = require("./routers/authRouter");
const blogRouter = require("./routers/blogRouter");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use("/auth", authRouter);
app.use("/blogs", blogRouter);

app.get("/", (req, res) => {
  res.status(200).send("Server is up and running!!!");
});

const PORT = process.env.PORT;

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE, () => {
    app.listen(PORT, () => {
      console.log("process listening on port " + PORT);
    });
  })
  .catch((err) => console.log(err));
