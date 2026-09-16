import { Fragment, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Badge, Button, Card, Col, Form, Row } from 'react-bootstrap';
import MeetupList from '../components/meetups/MeetupList';
import { connectToDatabase } from '../utils/db';
import {
  MEETUP_CATEGORIES,
  MEETUP_FORMATS,
  normalizeMeetupDocument,
} from '../utils/meetups';
import classes from '../styles/HomePage.module.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Trending first' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'newest', label: 'Newest' },
  { value: 'alphabetical', label: 'A to Z' },
];

function getEventTimestamp(eventDate) {
  return eventDate ? new Date(`${eventDate}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
}

function HomePage({ meetups, featuredMeetups }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [selectedSort, setSelectedSort] = useState('featured');

  const filteredMeetups = useMemo(() => {
    const lowerCasedSearch = searchTerm.trim().toLowerCase();

    return [...meetups]
      .filter((meetup) => {
        const matchesSearch =
          !lowerCasedSearch ||
          meetup.title.toLowerCase().includes(lowerCasedSearch) ||
          meetup.city.toLowerCase().includes(lowerCasedSearch) ||
          meetup.address.toLowerCase().includes(lowerCasedSearch);
        const matchesCategory =
          selectedCategory === 'All' || meetup.category === selectedCategory;
        const matchesFormat =
          selectedFormat === 'All' || meetup.eventType === selectedFormat;

        return matchesSearch && matchesCategory && matchesFormat;
      })
      .sort((firstMeetup, secondMeetup) => {
        if (selectedSort === 'alphabetical') {
          return firstMeetup.title.localeCompare(secondMeetup.title);
        }

        if (selectedSort === 'newest') {
          return new Date(secondMeetup.createdAt) - new Date(firstMeetup.createdAt);
        }

        if (selectedSort === 'upcoming') {
          return getEventTimestamp(firstMeetup.eventDate) - getEventTimestamp(secondMeetup.eventDate);
        }

        return (
          Number(secondMeetup.isFeatured) - Number(firstMeetup.isFeatured) ||
          secondMeetup.attendeeCount - firstMeetup.attendeeCount ||
          firstMeetup.title.localeCompare(secondMeetup.title)
        );
      });
  }, [meetups, searchTerm, selectedCategory, selectedFormat, selectedSort]);

  const stats = useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const upcomingCount = meetups.filter((meetup) => {
      if (!meetup.eventDate) {
        return false;
      }

      return new Date(`${meetup.eventDate}T00:00:00`) >= startOfToday;
    }).length;

    return [
      { label: 'Meetups live', value: meetups.length },
      { label: 'Featured picks', value: featuredMeetups.length },
      { label: 'Upcoming experiences', value: upcomingCount },
    ];
  }, [featuredMeetups.length, meetups]);

  return (
    <Fragment>
      <Head>
        <title>Misc Meetups | Discover standout community events</title>
        <meta
          name='description'
          content='Discover modern meetups, explore curated community experiences, and host standout events with Misc Meetups.'
        />
      </Head>

      <section className={classes.hero}>
        <div>
          <Badge bg='light' text='dark' className={classes.heroBadge}>
            New era meetup discovery
          </Badge>
          <h1>Find the right room, people, and energy for your next meetup.</h1>
          <p>
            Misc Meetups now blends discovery, hosting, and trust-building details into one
            responsive experience for attendees and organizers.
          </p>
          <div className={classes.heroActions}>
            <Button as='a' href='#discover' variant='dark'>
              Explore meetups
            </Button>
            <Button as={Link} href='/new-meetup' variant='outline-dark'>
              Host an event
            </Button>
          </div>
        </div>

        <Card className={classes.heroPanel}>
          <Card.Body>
            <span className={classes.heroPanelLabel}>This week&apos;s pulse</span>
            <h2>Better discovery, cleaner detail pages, and faster mobile browsing.</h2>
            <ul>
              <li>Search, filter, and sort meetups instantly</li>
              <li>Surface featured experiences and event formats</li>
              <li>Help people contact organizers with confidence</li>
            </ul>
          </Card.Body>
        </Card>
      </section>

      <section className={classes.stats}>
        {stats.map((stat) => (
          <Card key={stat.label} className={classes.statCard}>
            <Card.Body>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </Card.Body>
          </Card>
        ))}
      </section>

      {featuredMeetups.length > 0 && (
        <section className={classes.featuredSection}>
          <div className={classes.sectionHeading}>
            <div>
              <span className={classes.sectionKicker}>Curated highlights</span>
              <h2>Featured community experiences</h2>
            </div>
          </div>
          <MeetupList
            meetups={featuredMeetups}
            emptyTitle='No featured meetups yet'
            emptyDescription='Mark standout meetups as featured to spotlight them here.'
          />
        </section>
      )}

      <section id='discover' className={classes.discoverySection}>
        <div className={classes.sectionHeading}>
          <div>
            <span className={classes.sectionKicker}>Discover</span>
            <h2>Search smarter and find your next community moment</h2>
          </div>
          <p>
            Filter by category or format, sort by what matters, and quickly scan the best fit.
          </p>
        </div>

        <Card className={classes.filterCard}>
          <Card.Body>
            <Row className='g-3'>
              <Col lg={5}>
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type='search'
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder='Search by title, city, or venue'
                  />
                </Form.Group>
              </Col>
              <Col sm={6} lg={2}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                  >
                    <option value='All'>All</option>
                    {MEETUP_CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6} lg={2}>
                <Form.Group>
                  <Form.Label>Format</Form.Label>
                  <Form.Select
                    value={selectedFormat}
                    onChange={(event) => setSelectedFormat(event.target.value)}
                  >
                    <option value='All'>All</option>
                    {MEETUP_FORMATS.map((format) => (
                      <option key={format} value={format}>
                        {format}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6} lg={3}>
                <Form.Group>
                  <Form.Label>Sort</Form.Label>
                  <Form.Select
                    value={selectedSort}
                    onChange={(event) => setSelectedSort(event.target.value)}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <MeetupList
          meetups={filteredMeetups}
          emptyTitle='No meetups match your filters'
          emptyDescription='Try clearing one filter or host a fresh meetup to spark new interest.'
        />
      </section>
    </Fragment>
  );
}

export async function getStaticProps() {
  const { db, client } = await connectToDatabase(process.env.DB_NAME || 'test');
  const meetupsCollection = db.collection('meetups');
  const [meetups, featuredMeetups] = await Promise.all([
    meetupsCollection.find().sort({ createdAt: -1 }).toArray(),
    meetupsCollection.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(3).toArray(),
  ]);

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => normalizeMeetupDocument(meetup)),
      featuredMeetups: featuredMeetups.map((meetup) => normalizeMeetupDocument(meetup)),
    },
    revalidate: 30,
  };
}

export default HomePage;
