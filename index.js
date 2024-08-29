const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jv3edzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const userCollection = client.db('TourismManagementDB').collection('user');
    const TouristsSpotCollection = client.db('TourismManagementDB').collection('touristsSpot');
    const CountrySpotCollection = client.db('TourismManagementDB').collection('countrySideSpot');
    const AllTouristsSpotCollection = client.db('TourismManagementDB').collection('alltourists');
    const AddTouristsSpotCollection = client.db('TourismManagementDB').collection('addtourSpot');
    const BookNowCollection = client.db('TourismManagementDB').collection('mylist');

    app.get('/mylist', async(req, res) => {
      const cursor = BookNowCollection.find();
      const values = await cursor.toArray();
      res.send(values);
    });

    
    app.post('/mylist', async (req, res) => {
      try {
          const body = req.body;
          const result = await BookNowCollection.insertOne(body);
          res.status(201).send(result); // Send a 201 status for successful creation
      } catch (error) {
          console.error('Failed to insert document:', error);
          res.status(500).send({ message: 'Failed to add to mylist', error });
      }
    });

    app.delete('/mylist/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await BookNowCollection.deleteOne(query);
      res.send(result);
    });


    app.get('/alltourists', async(req, res)=>{
      const result = await AllTouristsSpotCollection.find().toArray();
      res.send(result);
    });

    app.get('/alltourists/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await AllTouristsSpotCollection.findOne(query);
      res.send(result);
    });

    app.post('/addtourSpot', async (req, res) => {
      try {
          const body = req.body;
          const result = await AddTouristsSpotCollection.insertOne(body);
          res.status(201).send(result); // Send a 201 status for successful creation
      } catch (error) {
          console.error('Failed to insert document:', error);
          res.status(500).send({ message: 'Failed to add to mylist', error });
      }
    });

    app.put('/alltourists/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const UpdatedTourSpot = req.body;
      const spots = {
        $set: {
          name: UpdatedTourSpot?.name,
          email: UpdatedTourSpot?.email,
          tourists_spot_name:UpdatedTourSpot?.tourists_spot_name, 
          country_name:UpdatedTourSpot?.country_name, 
          seasonality:UpdatedTourSpot?.seasonality, 
          location:UpdatedTourSpot?.location, 
          average_cost:UpdatedTourSpot?.average_cost, 
          travel_time:UpdatedTourSpot?.travel_time, 
          totalVisitorsPerYear:UpdatedTourSpot?.travel_time, 
          image:UpdatedTourSpot?.image,
          short_description:UpdatedTourSpot?.short_description,
        }
      }

      const result = await AllTouristsSpotCollection.updateOne(filter, spots, options);
      res.send(result);
    });
    
    app.get('/countrySideSpot', async(req, res)=>{
      const result = await CountrySpotCollection.find().toArray();
      res.send(result);
    });

    app.get('/countrySideSpot/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await CountrySpotCollection.findOne(query);
      res.send(result);
    });

    app.get('/touristsSpot', async(req, res)=>{
        const result = await TouristsSpotCollection.find().toArray();
        res.send(result);
    });
  
    app.get('/touristsSpot/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await TouristsSpotCollection.findOne(query);
        res.send(result);
    });

    // app.get('/user', async(req, res)=>{
    //     const cursor = userCollection.find();
    //     const users = await cursor.toArray();
    //     res.send(users);
    // })
  
    app.post('/user', async(req, res)=>{
        const user = req.body;
        console.log(user);
        const result = await userCollection.insertOne(user);
        res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.use('/', (req, res)=>{
    res.send('Tourism Management Services running')
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});