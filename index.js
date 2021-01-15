const express = require("express");
const fetch = require("node-fetch");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const db = mongoose.createConnection(
  "mongodb+srv://newUser:test@test.x6idm.mongodb.net/Test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const testSchema = new mongoose.Schema({
  results: [
    {
      gender: String,
      name: {
        title: String,
        first: String,
        last: String,
      },
      location: {
        street: {
          number: Number,
          name: String,
        },
        city: String,
        state: String,
        country: String,
        postcode: String,
        coordinates: {
          latitude: String,
          longitude: String,
        },
        timezone: {
          offset: String,
          description: String,
        },
      },
      email: String,
      login: {
        uuid: String,
        username: String,
        password: String,
        salt: String,
        md5: String,
        sha1: String,
        sha256: String,
      },
      dob: {
        date: String,
        age: Number,
      },
      registered: {
        date: String,
        age: Number,
      },
      phone: String,
      cell: String,
      userId: {
        name: String,
        value: String,
      },
      quote: String,
      picture: String,
      nat: String,
    },
  ],
  info: {
    seed: String,
    results: Number,
    page: Number,
    version: String,
  },
});

const testModel = db.model("test", testSchema);

app.get("/", async (req, res) => {
  const user = await testModel.find();
  res.send(user);
});

app.post("/", async (req, res) => {
  await testModel.deleteMany({});
  const count = 10;
  const users = [];

  for (var i = 0; i < count; i += 1) {
    var a;
    var quote;

    await fetch("https://api.kanye.rest/")
      .then((r) => r.json())
      .then((r) => {
        quote = r;
      })
      .catch((r) => console.log(r));

    await fetch("https://randomuser.me/api")
      .then((r) => r.json())
      .then((r) => {
        a = r;
        a.results[0].userId = r.results[0].id;
        delete a.results[0].picture;
      })
      .catch((r) => console.log(r));

    const testUser = new testModel(a);

    testUser.results[0].quote = quote.quote;
    await testUser.save();
  }

  res.sendStatus(200);
});

app.listen(9999);
