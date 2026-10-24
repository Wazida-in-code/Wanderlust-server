import express from 'express'
import { MongoClient } from 'mongodb';
import 'dotenv/config'

const app = express()
const PORT = 8000


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

connectToMongoDB()


app.get('/', (req, res) => {
    res.send({msg: "server is runing perfectly!"})
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})