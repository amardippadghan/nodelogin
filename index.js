const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

mongoose.connect(
  "mongodb+srv://amardippadghan2:admin123@cluster0.5avn1xf.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB!");
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.use(express.json());

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });
  await user.save();
  res.send(user);
});
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (user) {
    res.send(user);
  } else {
    res.send("User not found");
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.send(user);
  } else {
    res.send("Invalid email or password");
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
