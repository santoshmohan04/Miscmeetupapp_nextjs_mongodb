import { Card, Button, Container } from "react-bootstrap";
import classes from "./MeetupDetail.module.css";

function MeetupDetail({ image, title, address, description, onEdit, onDelete }) {
  return (
    <Container className="mt-4">
      <Card className="shadow-md">
        <Card.Img variant="top" src={image} alt={title} className={classes.image} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{address}</Card.Subtitle>
          <Card.Text>{description}</Card.Text>

          <div className="d-flex justify-content-end">
            <Button variant="warning" className="me-2" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default MeetupDetail;