import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

if (!MONGO_URI) {
  throw new Error("Missing MONGO_URI in environment variables");
}

export async function connectToDatabase() {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db(DB_NAME);
  return { db, client };
}