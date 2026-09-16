import { Col, Row } from 'react-bootstrap';
import MeetupItem from './MeetupItem';
import classes from './MeetupList.module.css';

function MeetupList({
  meetups,
  emptyTitle = 'No meetups available yet',
  emptyDescription = 'Create the first meetup to help people discover a new experience.',
}) {
  if (!meetups.length) {
    return (
      <div className={classes.emptyState}>
        <h3>{emptyTitle}</h3>
        <p>{emptyDescription}</p>
      </div>
    );
  }

  return (
    <Row className='g-4'>
      {meetups.map((meetup) => (
        <Col key={meetup.id} xs={12} md={6} xl={4}>
          <MeetupItem {...meetup} />
        </Col>
      ))}
    </Row>
  );
}

export default MeetupList;
