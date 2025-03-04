import { Fragment } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
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

    const data = await response.json();
    console.log(data);
    router.push('/');
  }

  return (
    <Fragment>
      <Head>
        <title>Add a New Meetup</title>
        <meta name="description" content="Add your own meetups and create amazing networking opportunities." />
      </Head>

      <Container className="mt-4">
        <h1 className="text-center mb-4">Add New Meetup</h1>
        <NewMeetupForm onAddMeetup={addMeetupHandler} />
      </Container>
    </Fragment>
  );
}

export default NewMeetupPage;