const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
var ObjectId = require("mongodb").ObjectId;


const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.srriw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db("pc_builder");
    const categoriesCollection = database.collection("categories");
    const productsCollection = database.collection("products");

    //post tasks

    app.get("/categories", async (req, res) => {
      const cursor = categoriesCollection.find({});
      const categories = await cursor.toArray();
      res.send(categories);
    });
 


    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const result = await productsCollection
        .find({ _id: new ObjectId(req.params.id) })
        .toArray();
        console.log(result)
      res.send(result[0]);
    });

    app.get("/filterproducts/:categoryid", async (req, res) => {
      console.log(req.params);
      id = req.params.categoryid;
      const cursor = productsCollection.find({ categoryId: id });
      const products = await cursor.toArray();
      console.log(products);
      res.send(products);
    });

    app.post("/categories", async (req, res) => {
      const categories = req.body;
      const result = await categoriesCollection.insertOne(categories);
      console.log(result);
      res.json(result);
    });

    console.log("connected pc_builder_db");
  } finally {
    //await client.close();
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("running pc_builder_db------");
});

app.listen(port, () => {
  console.log("running pc_builder_db-----", port);
});
