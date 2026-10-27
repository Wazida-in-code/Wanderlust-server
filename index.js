import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from 'cors'

const app = express()
const PORT = 8000
app.use(cors())
app.use(express.json())

const client = new MongoClient(process.env.MONGODB_CLIENT);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB()

const db = mongoClient.db("wanderlust")
const destinationCollection = db.collection("destination")
const bookingCollection = db.collection("bookings")


const verifyApi = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    if (authHeader !== 'user logged in!') {
        return res.status(401).send({ msg: "Unauthorized!" })
    }

    console.log("I'm middleware");

    next()
}


app.post('/add-destination', async(req, res) => {
    const data = req.body
    const result = await destinationCollection.insertOne(data)
    res.send(result)
})

app.get('/destinations', async (req, res) => {
    const result = await destinationCollection.find().toArray()
    res.send(result)
})


app.get('/destination/:id', verifyApi , 
    
    async(req, res) => {
    const {id} = req.params
    const result = await destinationCollection.findOne({_id: new ObjectId(id)})
    res.send(result)
})


app.patch('/destination/:id', async(req, res) => {
    const {id} = req.params
    const updatedData = req.body
    const result = await destinationCollection.updateOne(
        {_id: new ObjectId(id)}, {$set: updatedData}
    )
    res.json(result)
})


app.delete('/destination/:id', async(req, res) => {
    const {id} = req.params
    const result = await destinationCollection.deleteOne({_id: new ObjectId(id)})
    res.json(result)
})

// Booking
app.post('/booking', async(req, res) => {
    const data = req.body
    const result = await bookingCollection.insertOne(data)
    res.send(result)
    console.log(result);
})


app.get('/my-bookings/:email', async(req, res) => {
    const {email} = req.params
    const result = await bookingCollection.find({email:email}).toArray()
    res.send(result)
})

app.delete('/my-bookings/:id', async(req, res) => {
    const {id} = req.params
    const result = await bookingCollection.deleteOne({_id: id})
    res.send(result)
})


app.get('/', (req, res) => {
    res.send({msg: "server is runing perfectly!"})
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})