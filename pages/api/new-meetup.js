import { connectToDatabase } from '../../utils/db';
import {
  sanitizeMeetupPayload,
  validateMeetupPayload,
} from '../../utils/meetups';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const payload = sanitizeMeetupPayload(req.body);
  const validationErrors = validateMeetupPayload(payload);

  if (Object.keys(validationErrors).length > 0) {
    return res.status(422).json({
      message: 'Please review the meetup details and try again.',
      errors: validationErrors,
    });
  }

  const { db, client } = await connectToDatabase();

  try {
    const meetupsCollection = db.collection('meetups');
    const result = await meetupsCollection.insertOne(payload);

    return res.status(201).json({
      message: 'Meetup inserted!',
      id: result.insertedId.toString(),
    });
  } finally {
    client.close();
  }
}

export default handler;
