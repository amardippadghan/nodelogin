const express = require("express");
const mongoose = require("mongoose");


const app = express();
const port = 3000;

app.use(express.json());

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
  fname: String,
  lname: String,
  email: String,
  contact: Number,
  
  address: String,
  state: String,
  password: String,
});


const User = mongoose.model("User", userSchema);

app.use(express.json());

app.post("/api/register", async (req, res) => {
  const { fname, lname, email, contact, address, state, password } = req.body;
  const user = new User({
    fname,
    lname,
    email,
    contact,
    address,
    state,
    password,
  });
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
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
})

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).send("Email not found");
  } else {
    if (user.password === password) {
      res.send(user);
    } else {
      res.status(401).send("Invalid password");
    }
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (user) {
    res.send(user);
  } else {
    res.send("User not found");
  }
}
);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
