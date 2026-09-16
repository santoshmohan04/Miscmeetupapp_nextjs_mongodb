import { Fragment } from 'react';
import Head from 'next/head';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import MeetupForm from '../../../components/meetups/MeetupForm';
import { connectToDatabase } from '../../../utils/db';
import { normalizeMeetupDocument } from '../../../utils/meetups';

export default function EditMeetup(props) {
  const router = useRouter();

  async function handleSubmit(updatedMeetup) {
    const response = await fetch(`/api/meetups/${props.meetupData.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedMeetup),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Unable to update the meetup.');
    }

    await router.push(`/${props.meetupData.id}`);
  }

  return (
    <Fragment>
      <Head>
        <title>Edit Meetup | {props.meetupData.title}</title>
        <meta
          name='description'
          content='Refine meetup details, improve trust signals, and keep your event listing fresh.'
        />
      </Head>

      <MeetupForm
        initialValues={props.meetupData}
        title='Refresh your meetup experience'
        subtitle='Keep your event details accurate so attendees can discover and trust the listing.'
        submitLabel='Save updates'
        onSubmit={handleSubmit}
      />
    </Fragment>
  );
}

export async function getStaticPaths() {
  const { db, client } = await connectToDatabase();
  const meetupsCollection = db.collection('meetups');
  const meetups = await meetupsCollection.find({}, { projection: { _id: 1 } }).toArray();

  client.close();

  return {
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
    fallback: 'blocking',
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  if (!meetupId || typeof meetupId !== 'string') {
    return { notFound: true };
  }

  const { db, client } = await connectToDatabase();
  const meetupsCollection = db.collection('meetups');

  try {
    const selectedMeetup = await meetupsCollection.findOne({
      _id: new ObjectId(meetupId),
    });

    if (!selectedMeetup) {
      return { notFound: true };
    }

    return {
      props: {
        meetupData: normalizeMeetupDocument(selectedMeetup),
      },
      revalidate: 30,
    };
  } finally {
    await client.close();
  }
}
