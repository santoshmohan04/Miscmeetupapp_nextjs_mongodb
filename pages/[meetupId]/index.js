import { Fragment, useState } from 'react';
import Head from 'next/head';
import { ObjectId } from 'mongodb';
import { useRouter } from 'next/router';
import MeetupDetail from '../../components/meetups/MeetupDetail';
import { connectToDatabase } from '../../utils/db';
import { normalizeMeetupDocument } from '../../utils/meetups';

function MeetupDetails(props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEdit = () => {
    router.push(`/edit/${props.meetupData.id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this meetup? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/meetups/${props.meetupData.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to delete meetup.');
      }

      await router.push('/');
    } catch (error) {
      setErrorMessage(error.message || 'Failed to delete meetup.');
      setIsDeleting(false);
    }
  };

  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title} | Misc Meetups</title>
        <meta name='description' content={props.meetupData.description} />
      </Head>

      <MeetupDetail
        meetup={props.meetupData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        errorMessage={errorMessage}
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
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
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

export default MeetupDetails;
