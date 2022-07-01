const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(express.json());
app.use(cors());

// Getting connected to DB
const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  ObjectID,
} = require("mongodb");
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

    // TO POST A TASK
    app.post("/addTask", async (req, res) => {
      const { taskDetails } = req.body;
      const result = await todoCollection.insertOne(taskDetails);
      res.send(result);
    });

    // TO DELETE A TASK
    app.post("/addToComplete", async (req, res) => {
      const { task } = req?.body;

      const id = task._id;

      const filter = { _id: ObjectId(id) };
      // Deleting from todo
      const deleteResult = await todoCollection.deleteOne(filter);
      // Adding to completed
      const addResult = await completedCollection.insertOne(task);

      res.send([deleteResult, addResult]);
    });

    // GET TASKs
    app.get("/getTask/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await todoCollection.find(filter).toArray();
      res.send(result);
    });

    // GET completed TASKs
    app.get("/getCompletedTasks/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const result = await completedCollection.find(filter).toArray();
      res.send(result);
    });

    // Updating a task
    app.post("/updateTask/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const { updatedTaskDetails } = req.body;
      const updatedDoc = {
        $set: updatedTaskDetails,
      };
      const result = await todoCollection.updateOne(filter, updatedDoc);
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
