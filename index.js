const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port =process.env.PORT || 9000

const app = express()
const corsOptions = {
    origin:['http://localhost:5173','http://localhost:5174'],
    credential: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x22d1po.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` ;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    const craftCardCollection=client.db('craftDB').collection('cards');

    // get all cards from mongo
    app.get('/cards',async(req,res)=>{
      const cursor =craftCardCollection.find();
      const result =await cursor.toArray();
      res.send(result);

    })
    //get a single card from mongodb
    app.get('/card/:id',async(req,res)=>{
      const id = req.params.id;
      const query ={ _id: new ObjectId(id)}
      const result=await craftCardCollection.findOne(query)
      res.send(result)
    })

    app.get('/cards/:email',async(req,res)=>{

      console.log(req.params)
      const result = await craftCardCollection.find({email:req.params.email}).toArray();
      res.send(result)

    })
    // delete single card
    app.delete('/card/:id',async(req,res)=>{
      const id = req.params.id;
      const query ={ _id: new ObjectId(id)}
      const result=await craftCardCollection.deleteOne(query)
      res.send(result)
    })
    // post All cards

    app.post('/cards',async(req,res)=>{
      const addCraftItem= req.body;
      console.log(addCraftItem);
      const result = await craftCardCollection.insertOne(addCraftItem)
      res.send(result);
    })
    // update
    app.put('/card/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id : new ObjectId(id)};
      const options ={upsert : true};
      const updatedCraft=req.body;
      const updated={
        $set:{
          item_name:updatedCraft.item_name,
          subcategory_Name:updatedCraft.subcategory_Name,
          price:updatedCraft.price,
          rating:updatedCraft.rating,
          processing:updatedCraft.processing,
          image:updatedCraft.image,
          description:updatedCraft.description,
          customization:updatedCraft.customization,
          stock:updatedCraft.stock,

        }
      }
      const result=await craftCardCollection.updateOne(filter,updated,options);
      res.send(result)

    })

 
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
 
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('art and craft.....')
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
// https://i.ibb.co/qYxrQPq/6243546.jpg
// https://i.ibb.co/qmsWjFT/drawing-about-legal-profession.jpg
// https://i.ibb.co/G2gpqX2/beautiful-watercolor-floral-arrangement.jpg
// https://i.ibb.co/WDpRjNk/india-republic-day-celebration-digital-art-with-woman-portrait.jpg
// https://i.ibb.co/4P0Yqk0/5216.jpg
// https://i.ibb.co/nrwJfT8/8438006.jpg
// https://i.ibb.co/8NwKmLf/abstract-hand-painted-landscape-scene-impressionist-style-2906.jpg 
// https://i.ibb.co/85Bkm9x/6656381.jpg