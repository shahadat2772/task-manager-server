const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(express.json());
app.use(cors());

// Getting connected to DB
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { use } = require("express/lib/application");
const { response } = require("express");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q7tip.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    // TODO
    const todoCollection = client.db("task-manager").collection("todo");
    // COMPLETED
    const completedCollection = client
      .db("task-manager")
      .collection("completed");

    // APIS
    app.post("/addTask", async (req, res) => {
      const { taskDetails } = req.body;
      const result = await todoCollection.insertOne(taskDetails);
      res.send(result);
    });

    app.get("/getTask/:email", async (req, res) => {
      // res.send(result);
      const email = req.params.email;
      const filter = { email: email };
      const result = await todoCollection.find(filter).toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

// Calling the run function
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(port, () => {
  console.log("Responding to", port);
});
