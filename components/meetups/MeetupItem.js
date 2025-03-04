import { useRouter } from "next/router";
import { Card, Button } from "react-bootstrap";

function MeetupItem(props) {
  const router = useRouter();

  function showDetailsHandler() {
    router.push("/" + props.id);
  }

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={props.image} alt={props.title} className="img-fluid" />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          <strong>Address:</strong> {props.address}
        </Card.Text>
        <Button variant="primary" onClick={showDetailsHandler}>
          Show Details
        </Button>
      </Card.Body>
    </Card>
  );
}

export default MeetupItem;