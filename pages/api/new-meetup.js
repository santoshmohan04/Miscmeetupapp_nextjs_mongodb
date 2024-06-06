import { MongoClient } from 'mongodb';

// /api/new-meetup
// POST /api/new-meetup

async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    const uri = `mongodb+srv://mohan412:06c01a1036@cluster0.2ifj302.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    const client = await MongoClient.connect(uri);
    const db = client.db('test');

    const meetupsCollection = db.collection('meetups');

    const result = await meetupsCollection.insertOne(data);

    console.log(result);

    client.close();

    res.status(201).json({ message: 'Meetup inserted!' });    
  }
}

export default handler;
