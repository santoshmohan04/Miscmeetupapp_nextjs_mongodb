import { useRef } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';

function NewMeetupForm(props) {
  const titleInputRef = useRef();
  const imageInputRef = useRef();
  const addressInputRef = useRef();
  const descriptionInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredTitle = titleInputRef.current.value;
    const enteredImage = imageInputRef.current.value;
    const enteredAddress = addressInputRef.current.value;
    const enteredDescription = descriptionInputRef.current.value;

    const meetupData = {
      title: enteredTitle,
      image: enteredImage,
      address: enteredAddress,
      description: enteredDescription,
    };

    props.onAddMeetup(meetupData);
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title className="text-center mb-4">Add New Meetup</Card.Title>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3">
              <Form.Label>Meetup Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" ref={titleInputRef} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Meetup Image</Form.Label>
              <Form.Control type="url" placeholder="Image URL" ref={imageInputRef} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" placeholder="Address" ref={addressInputRef} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={5} ref={descriptionInputRef} required />
            </Form.Group>

            <div className="text-center">
              <Button variant="primary" type="submit">
                Add Meetup
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default NewMeetupForm;