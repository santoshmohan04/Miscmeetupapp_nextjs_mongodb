import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
const MONGO_URI = process.env.MONGO_URI;
import MeetupDetail from "../../components/meetups/MeetupDetail";
import { useRouter } from "next/router";

function MeetupDetails(props) {
  const router = useRouter();

  // Edit Action
  const handleEdit = () => {
    router.push(`/edit/${props.meetupData.id}`); // Navigate to edit page
  };

  // Delete Action
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this meetup?")) {
      const response = await fetch(`/api/meetups/${props.meetupData.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Meetup deleted successfully!");
        router.push("/"); // Redirect to home after deletion
      } else {
        alert("Failed to delete meetup.");
      }
    }
  };

  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>

      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <MeetupDetail
              image={props.meetupData.image}
              title={props.meetupData.title}
              address={props.meetupData.address}
              description={props.meetupData.description}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(MONGO_URI);
  const db = client.db("test");

  const meetupsCollection = db.collection("meetups");
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
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
      }
    };
  } finally {
    await client.close(); // Always close the connection
  }
}

export default MeetupDetails;