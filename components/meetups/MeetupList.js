import { Container, Row, Col } from "react-bootstrap";
import MeetupItem from "./MeetupItem";

function MeetupList(props) {
  return (
    <Container className="mt-4">
      <Row>
        {props.meetups.map((meetup) => (
          <Col key={meetup.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <MeetupItem
              id={meetup.id}
              image={meetup.image}
              title={meetup.title}
              address={meetup.address}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default MeetupList;