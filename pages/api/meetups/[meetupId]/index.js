import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../utils/db';
import {
  sanitizeMeetupPayload,
  validateMeetupPayload,
} from '../../../../utils/meetups';

export default async function handler(req, res) {
  const { meetupId } = req.query;

  if (!meetupId || typeof meetupId !== 'string' || !ObjectId.isValid(meetupId)) {
    return res.status(400).json({ message: 'Invalid meetup ID' });
  }

  let client;
  let db;

  try {
    ({ client, db } = await connectToDatabase(process.env.DB_NAME || 'test'));
    const meetupsCollection = db.collection('meetups');

    if (req.method === 'PUT') {
      const existingMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupId) });

      if (!existingMeetup) {
        return res.status(404).json({ message: 'Meetup not found' });
      }

      const submittedMeetup = req.body || {};
      const hasField = (fieldName) =>
        Object.prototype.hasOwnProperty.call(submittedMeetup, fieldName);

      const updatedMeetup = sanitizeMeetupPayload({
        title: hasField('title') ? submittedMeetup.title : existingMeetup.title,
        image: hasField('image') ? submittedMeetup.image : existingMeetup.image,
        address: hasField('address') ? submittedMeetup.address : existingMeetup.address,
        description: hasField('description')
          ? submittedMeetup.description
          : existingMeetup.description,
        category: hasField('category') ? submittedMeetup.category : existingMeetup.category,
        eventType: hasField('eventType') ? submittedMeetup.eventType : existingMeetup.eventType,
        eventDate: hasField('eventDate') ? submittedMeetup.eventDate : existingMeetup.eventDate,
        city: hasField('city') ? submittedMeetup.city : existingMeetup.city,
        organizerName: hasField('organizerName')
          ? submittedMeetup.organizerName
          : existingMeetup.organizerName,
        organizerEmail: hasField('organizerEmail')
          ? submittedMeetup.organizerEmail
          : existingMeetup.organizerEmail,
        isFeatured: hasField('isFeatured')
          ? submittedMeetup.isFeatured
          : existingMeetup.isFeatured,
        attendeeCount: existingMeetup.attendeeCount,
        createdAt: existingMeetup.createdAt,
      }, { applyDefaults: false });
      const validationErrors = validateMeetupPayload(updatedMeetup);

      if (Object.keys(validationErrors).length > 0) {
        return res.status(422).json({
          message: 'Please review the meetup details and try again.',
          errors: validationErrors,
        });
      }

      await meetupsCollection.updateOne(
        { _id: new ObjectId(meetupId) },
        { $set: updatedMeetup }
      );

      await res.revalidate('/');
      await res.revalidate(`/${meetupId}`);

      return res.status(200).json({ message: 'Meetup updated successfully!' });
    }

    if (req.method === 'DELETE') {
      const result = await meetupsCollection.deleteOne({ _id: new ObjectId(meetupId) });

      if (result.deletedCount === 1) {
        await res.revalidate('/');
        await res.revalidate(`/${meetupId}`);
        return res.status(200).json({ message: 'Meetup deleted successfully!' });
      }

      return res.status(404).json({ message: 'Meetup not found' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
