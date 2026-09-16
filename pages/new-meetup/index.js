import { Fragment } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NewMeetupForm from '../../components/meetups/NewMeetupForm';

function NewMeetupPage() {
  const router = useRouter();

  async function addMeetupHandler(enteredMeetupData) {
    const response = await fetch('/api/new-meetup', {
      method: 'POST',
      body: JSON.stringify(enteredMeetupData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Unable to publish the meetup.');
    }

    await router.push('/');
  }

  return (
    <Fragment>
      <Head>
        <title>Host a Meetup | Misc Meetups</title>
        <meta
          name='description'
          content='Create a polished meetup listing with modern discovery details and organizer information.'
        />
      </Head>

      <NewMeetupForm
        title='Create a meetup people want to join'
        subtitle='Add the details attendees care about most and publish a more discoverable event listing.'
        submitLabel='Publish meetup'
        onSubmit={addMeetupHandler}
      />
    </Fragment>
  );
}

export default NewMeetupPage;
