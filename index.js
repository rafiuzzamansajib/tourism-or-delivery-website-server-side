 const express = require('express');
const { MongoClient } = require('mongodb');
const  ObjectID = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gxvqj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('database conneted');
    const database = client.db('tourismdb');
    const packageCollection = database.collection('packages');
    const orderCollection = database.collection('orderplace');

    // Get servise API
    app.get('/packages',async(req,res)=>{
        const cursor = packageCollection.find({});
        const packages = await cursor.toArray();
        res.send(packages);
    })

        // GET Single Service
        app.get('/packages/:id', async (req, res) => {
          const id = req.params.id;
          console.log('getting specific service', id);
          const query = { _id: ObjectID(id) };
          const package = await packageCollection.findOne(query);
          res.json(package);
      })
      // Get orders Api
      app.get('/orderplace',async(req,res)=>{
        const cursor = orderCollection.find({});
        const Orders = await cursor.toArray();
        res.send(Orders);

      })
      // Get single order
      app.get('/orderplace/:id',async(req,res)=>{
        const id = req.params.id;
        console.log('getting specific orders', id);
        const query = { _id: ObjectID(id) };
        const order = await orderCollection.findOne(query);
        res.json(order);

      })
    // POST API
    app.post('/packages', async (req, res) => {
      const package = req.body;
      console.log('hit the post api', package);

      const result = await packageCollection.insertOne(package);
      console.log(result);
      res.json(result)
  });
    // Add Orders API
    app.post('/orderplace', async (req, res) => {
          const order = req.body;
          const result = await orderCollection.insertOne(order);
          res.json(result);
      })

      // Delete ApI
      app.delete('/orderplace/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectID(id) };
        const result = await orderCollection.deleteOne(query);
        res.json(result);
    })


  } 
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tourism server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})