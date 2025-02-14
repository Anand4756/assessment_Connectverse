require("dotenv").config();

const express = require("express");

const app = express();

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:5173", // Allow only this origin
  credentials: true, // Allow credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/auth", require("./routes/auth.route"));

app.get("/", (req, res) => {
  res.json("hello from backend");
});

const port = 8080 || process.env.PORT;
app.listen(port, () => {
  console.log(`server started at ${port}`);
});

module.exports = app;
