import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error('Missing MONGO_URI in environment variables');
}

export async function connectToDatabase(databaseName = process.env.DB_NAME) {
  if (!databaseName) {
    throw new Error('Missing DB_NAME in environment variables');
  }

  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db(databaseName);
  return { db, client };
}
