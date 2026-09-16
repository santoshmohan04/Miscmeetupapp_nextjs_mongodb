import Link from 'next/link';
import { Badge, Button, Card } from 'react-bootstrap';
import classes from './MeetupItem.module.css';

function MeetupItem({
  id,
  image,
  title,
  address,
  city,
  category,
  eventType,
  eventDate,
  isFeatured,
  attendeeCount,
}) {
  const dateLabel = eventDate
    ? new Date(eventDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Date coming soon';

  return (
    <Card className={classes.card}>
      <div className={classes.imageWrap}>
        <Card.Img variant='top' src={image} alt={title} className={classes.image} />
        <div className={classes.badges}>
          {isFeatured && <Badge bg='warning' text='dark'>Featured</Badge>}
          <Badge bg='light' text='dark'>
            {category}
          </Badge>
        </div>
      </div>

      <Card.Body className={classes.body}>
        <div className={classes.metaRow}>
          <span>{eventType}</span>
          <span>{dateLabel}</span>
        </div>
        <Card.Title className={classes.title}>{title}</Card.Title>
        <Card.Text className={classes.location}>
          {city || 'City to be announced'} · {address}
        </Card.Text>
        <p className={classes.socialProof}>
          {attendeeCount > 0
            ? `${attendeeCount}+ people interested`
            : 'Be the first to show interest'}
        </p>
        <div className={classes.actions}>
          <Button as={Link} href={`/${id}`} variant='dark'>
            View experience
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default MeetupItem;
