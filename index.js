const express = require("express");
const app = express();
var cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tkswl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("task");
    const dataCollection = database.collection("data");

    // get users
    app.get("/datas", async (req, res) => {
      const cursor = dataCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // add user to database
    app.post("/datas", async (req, res) => {
      const service = req.body;
      const result = await dataCollection.insertOne(service);
      res.json(result);
    });

    // delete an user
    app.delete("/datas/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await dataCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
