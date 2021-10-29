// 
// 
const express = require('express');
const { MongoClient } = require('mongodb');
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
    const packageCollection = database.collection('package');

    // Get servise API
    app.get('/package',async(req,res)=>{
        const cursor = packageCollection.find({});
        const packages = await cursor.toArray();
        res.send(packages)
        console.log(packages);
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