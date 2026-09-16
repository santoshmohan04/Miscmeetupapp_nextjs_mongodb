import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import classes from './MeetupDetail.module.css';

function getSavedMeetupIds() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const savedMeetups = JSON.parse(window.localStorage.getItem('savedMeetups') || '[]');
    return Array.isArray(savedMeetups) ? savedMeetups : [];
  } catch {
    return [];
  }
}

function MeetupDetail({
  meetup,
  onEdit,
  onDelete,
  isDeleting = false,
  errorMessage = '',
}) {
  const [isSaved, setIsSaved] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedMeetups = getSavedMeetupIds();
    setIsSaved(savedMeetups.includes(meetup.id));
  }, [meetup.id]);

  useEffect(() => {
    if (!shareMessage) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setShareMessage(''), 2500);
    return () => window.clearTimeout(timeout);
  }, [shareMessage]);

  const dateLabel = useMemo(() => {
    if (!meetup.eventDate) {
      return 'Schedule to be announced';
    }

    return new Date(meetup.eventDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, [meetup.eventDate]);

  async function handleShare() {
    if (typeof window === 'undefined') {
      return;
    }

    const shareUrl = window.location.href;
    const shareData = {
      title: meetup.title,
      text: meetup.description,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage('Meetup shared.');
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareMessage(`Link copied to clipboard: ${shareUrl}`);
        return;
      }

      setShareMessage(`Copy this meetup link: ${shareUrl}`);
    } catch {
      setShareMessage(`Unable to auto-share. Copy this meetup link: ${shareUrl}`);
    }
  }

  function toggleSave() {
    if (typeof window === 'undefined') {
      return;
    }

    const savedMeetups = getSavedMeetupIds();
    const nextSavedMeetups = isSaved
      ? savedMeetups.filter((savedId) => savedId !== meetup.id)
      : [...new Set([...savedMeetups, meetup.id])];

    window.localStorage.setItem('savedMeetups', JSON.stringify(nextSavedMeetups));
    setIsSaved(!isSaved);
  }

  return (
    <section className={classes.wrapper}>
      <Card className={classes.heroCard}>
        <Row className='g-0 align-items-stretch'>
          <Col lg={6}>
            <img src={meetup.image} alt={meetup.title} className={classes.image} />
          </Col>
          <Col lg={6}>
            <Card.Body className={classes.content}>
              <div className={classes.topMeta}>
                <Badge bg='warning' text='dark'>
                  {meetup.category}
                </Badge>
                <Badge bg='light' text='dark'>
                  {meetup.eventType}
                </Badge>
                {meetup.isFeatured && (
                  <Badge bg='success'>Featured experience</Badge>
                )}
              </div>

              <h1>{meetup.title}</h1>
              <p className={classes.lead}>{meetup.description}</p>

              <div className={classes.highlights}>
                <div>
                  <span>When</span>
                  <strong>{dateLabel}</strong>
                </div>
                <div>
                  <span>Where</span>
                  <strong>{meetup.city || 'City to be announced'}</strong>
                </div>
                <div>
                  <span>Host</span>
                  <strong>{meetup.organizerName}</strong>
                </div>
              </div>

              <p className={classes.address}>{meetup.address}</p>
              <p className={classes.socialProof}>
                {meetup.attendeeCount > 0
                  ? `${meetup.attendeeCount}+ attendees already interested`
                  : 'Fresh listing — perfect time to claim a spot.'}
              </p>

              <div className={classes.actionGroup}>
                <Button variant='dark' onClick={handleShare}>
                  Share meetup
                </Button>
                <Button variant='outline-dark' onClick={toggleSave}>
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
                {meetup.organizerEmail && (
                  <Button
                    as='a'
                    href={`mailto:${meetup.organizerEmail}?subject=${encodeURIComponent(`Interest in ${meetup.title}`)}`}
                    variant='success'
                  >
                    Contact organizer
                  </Button>
                )}
              </div>

              {(shareMessage || errorMessage) && (
                <div className={classes.inlineFeedback}>
                  {shareMessage || errorMessage}
                </div>
              )}

              <div className={classes.manageActions}>
                <Button variant='outline-secondary' onClick={onEdit}>
                  Edit
                </Button>
                <Button variant='danger' onClick={onDelete} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </section>
  );
}

export default MeetupDetail;
