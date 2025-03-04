import { MongoClient, ObjectId } from "mongodb";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Form, Button } from "react-bootstrap";

export default function EditMeetup(props) {
  const router = useRouter();
  const [meetup, setMeetup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMeetup(props.meetupData);
    setLoading(false);
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedMeetup = {
      title: event.target.title.value,
      address: event.target.address.value,
      description: event.target.description.value,
      image: event.target.image.value,
    };

    const response = await fetch(`/api/meetups/${meetup.id}`, {
      method: "PUT",
      body: JSON.stringify(updatedMeetup),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      alert("Meetup updated successfully!");
      router.push(`/`); // Redirect to home after update
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container className="mt-4">
      <h2>Edit Meetup</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" name="title" defaultValue={meetup.title} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" name="address" defaultValue={meetup.address} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" name="description" defaultValue={meetup.description} rows={8} required />
        </Form.Group>

        <Form.Group>
          <Form.Label>Image URL</Form.Label>
          <Form.Control type="url" name="image" defaultValue={meetup.image} required />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Update Meetup
        </Button>
      </Form>
    </Container>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db("test");
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
    fallback: "blocking",
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId; // Ensure it's a string

  if (!meetupId || typeof meetupId !== "string") {
    return { notFound: true }; // Return 404 if meetupId is invalid
  }

  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect(); // Explicitly connect (if not using autoConnect)
  const db = client.db("test");
  const meetupsCollection = db.collection("meetups");

  try {
    // Convert meetupId explicitly to ObjectId
    const selectedMeetup = await meetupsCollection.findOne({
      _id: new ObjectId(meetupId),
    });

    if (!selectedMeetup) {
      return { notFound: true };
    }

    return {
      props: {
        meetupData: {
          id: selectedMeetup._id.toString(),
          title: selectedMeetup.title,
          address: selectedMeetup.address,
          image: selectedMeetup.image,
          description: selectedMeetup.description,
        },
      },
      revalidate: 10, // Revalidate every 10 seconds
    };
  } finally {
    await client.close(); // Always close the connection
  }
}

