import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import classes from './NewMeetupForm.module.css';
import {
  getMeetupInitialValues,
  MEETUP_CATEGORIES,
  MEETUP_FORMATS,
  sanitizeMeetupPayload,
  validateMeetupPayload,
} from '../../utils/meetups';

function MeetupForm({
  initialValues,
  title,
  subtitle,
  submitLabel,
  onSubmit,
}) {
  const defaults = useMemo(() => getMeetupInitialValues(initialValues), [initialValues]);
  const [formData, setFormData] = useState(defaults);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(defaults);
    setErrors({});
    setFormError('');
  }, [defaults]);

  function changeHandler(event) {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();

    const payload = sanitizeMeetupPayload(formData, initialValues);
    const validationErrors = validateMeetupPayload(payload);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      await onSubmit(payload);
    } catch (error) {
      setFormError(error.message || 'Unable to save the meetup right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className={classes.card}>
      <Card.Body className={classes.body}>
        <div className={classes.header}>
          <span className={classes.kicker}>Modern meetup manager</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {formError && <Alert variant='danger'>{formError}</Alert>}

        <Form onSubmit={submitHandler} noValidate>
          <Row className='g-3'>
            <Col md={8}>
              <Form.Group>
                <Form.Label>Meetup title</Form.Label>
                <Form.Control
                  type='text'
                  name='title'
                  value={formData.title}
                  onChange={changeHandler}
                  isInvalid={Boolean(errors.title)}
                  placeholder='Design for developers brunch'
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Category</Form.Label>
                <Form.Select name='category' value={formData.category} onChange={changeHandler}>
                  {MEETUP_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Event format</Form.Label>
                <Form.Select name='eventType' value={formData.eventType} onChange={changeHandler}>
                  {MEETUP_FORMATS.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Event date</Form.Label>
                <Form.Control
                  type='date'
                  name='eventDate'
                  value={formData.eventDate}
                  onChange={changeHandler}
                  isInvalid={Boolean(errors.eventDate)}
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.eventDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type='text'
                  name='city'
                  value={formData.city}
                  onChange={changeHandler}
                  isInvalid={Boolean(errors.city)}
                  placeholder='Bengaluru'
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.city}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Organizer name</Form.Label>
                <Form.Control
                  type='text'
                  name='organizerName'
                  value={formData.organizerName}
                  onChange={changeHandler}
                  isInvalid={Boolean(errors.organizerName)}
                  placeholder='Misc Meetups Team'
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.organizerName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Venue or meeting address</Form.Label>
                <Form.Control
                  type='text'
                  name='address'
                  value={formData.address}
                  onChange={changeHandler}
                  isInvalid={Boolean(errors.address)}
                  placeholder='Indiranagar, Bengaluru, Karnataka'
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Organizer email</Form.Label>
                <Form.Control
                  type='email'
                  name='organizerEmail'
                  value={formData.organizerEmail}
                  onChange={changeHandler}
                  isInvalid={Boolean(errors.organizerEmail)}
                  placeholder='hello@miscmeetups.com'
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.organizerEmail}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Cover image URL</Form.Label>
                <Form.Control
                  type='url'
                  name='image'
                  value={formData.image}
                  onChange={changeHandler}
                  isInvalid={Boolean(errors.image)}
                  placeholder='https://images.unsplash.com/...'
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.image}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label>Meetup description</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={6}
                  name='description'
                  value={formData.description}
                  onChange={changeHandler}
                  isInvalid={Boolean(errors.description)}
                  placeholder='Tell attendees what they will learn, who should join, and what makes this meetup special.'
                />
                <Form.Control.Feedback type='invalid'>
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Check
                type='switch'
                id='isFeatured'
                name='isFeatured'
                label='Highlight this meetup in discovery sections'
                checked={formData.isFeatured}
                onChange={changeHandler}
              />
            </Col>
          </Row>

          <div className={classes.actions}>
            <Button type='submit' variant='dark' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size='sm' animation='border' className='me-2' />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default MeetupForm;
