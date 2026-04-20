import express from "express";
import dotenv from "dotenv";
import passport from "./config/passport.js";
import session from "express-session";
import connectToDb from "./config/db.js";

dotenv.config();
connectToDb();

const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET!,

}));

app.use(passport.initialize());
app.use(passport.session());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
    