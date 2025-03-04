import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  const { meetupId } = req.query;

  if (!meetupId || typeof meetupId !== "string") {
    return res.status(400).json({ message: "Invalid meetup ID" });
  }

  let client;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect(); // Explicitly connect (MongoDB 6.0.0)
    const db = client.db("test");
    const meetupsCollection = db.collection("meetups");

    if (req.method === "PUT") {
      // Handle Update Meetup (PUT)
      const updatedMeetup = req.body;

      const result = await meetupsCollection.updateOne(
        { _id: new ObjectId(meetupId) },
        { $set: updatedMeetup }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Meetup not found" });
      }

      return res.status(200).json({ message: "Meetup updated successfully!" });
    }

    if (req.method === "DELETE") {
      // Handle Delete Meetup (DELETE)
      const result = await meetupsCollection.deleteOne({ _id: new ObjectId(meetupId) });

      if (result.deletedCount === 1) {
        return res.status(200).json({ message: "Meetup deleted successfully!" });
      } else {
        return res.status(404).json({ message: "Meetup not found" });
      }
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error handling request:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    if (client) await client.close(); // Ensure DB connection is closed
  }
}