import { MongoClient } from 'mongodb';
const MONGO_URI = process.env.MONGO_URI;

// /api/new-meetup
// POST /api/new-meetup

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db('test');

    const meetupsCollection = db.collection('meetups');

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: 'Meetup inserted!' });    
  }
}

export default handler;
