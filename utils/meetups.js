export const MEETUP_CATEGORIES = [
  'Tech',
  'Design',
  'Startup',
  'Community',
  'Wellness',
  'Career',
];

export const MEETUP_FORMATS = ['In person', 'Online', 'Hybrid'];

const DEFAULT_CATEGORY = 'Community';
const DEFAULT_FORMAT = 'In person';

function toText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function toBoolean(value) {
  return value === true || value === 'true' || value === 'on';
}

function normalizeCategory(value) {
  return MEETUP_CATEGORIES.includes(value) ? value : DEFAULT_CATEGORY;
}

function normalizeFormat(value) {
  return MEETUP_FORMATS.includes(value) ? value : DEFAULT_FORMAT;
}

function normalizeDate(value) {
  const text = toText(value);

  if (!text) {
    return '';
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const calendarDateMatch = text.match(/^(\d{4}-\d{2}-\d{2})/);
  if (calendarDateMatch) {
    return calendarDateMatch[1];
  }

  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function deriveCityFromAddress(address) {
  const segments = toText(address)
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);

  return segments.length > 1 ? segments[segments.length - 2] : segments[0] || '';
}

export function sanitizeMeetupPayload(input = {}, existingMeetup = {}) {
  const category = normalizeCategory(toText(input.category) || existingMeetup.category);
  const eventType = normalizeFormat(toText(input.eventType) || existingMeetup.eventType);
  const eventDate = normalizeDate(input.eventDate || existingMeetup.eventDate);
  const address = toText(input.address) || toText(existingMeetup.address);
  const city = toText(input.city) || toText(existingMeetup.city) || deriveCityFromAddress(address);
  const organizerName =
    toText(input.organizerName) ||
    toText(existingMeetup.organizerName) ||
    'Community host';
  const organizerEmail = toText(input.organizerEmail) || toText(existingMeetup.organizerEmail);
  const attendeeCount = Math.max(
    0,
    Number(input.attendeeCount ?? existingMeetup.attendeeCount ?? 0) || 0
  );

  return {
    title: toText(input.title) || toText(existingMeetup.title),
    image: toText(input.image) || toText(existingMeetup.image),
    address,
    city,
    description: toText(input.description) || toText(existingMeetup.description),
    category,
    eventType,
    eventDate,
    organizerName,
    organizerEmail,
    isFeatured:
      typeof input.isFeatured !== 'undefined'
        ? toBoolean(input.isFeatured)
        : Boolean(existingMeetup.isFeatured),
    attendeeCount,
    createdAt:
      toText(existingMeetup.createdAt) ||
      toText(input.createdAt) ||
      new Date().toISOString(),
  };
}

export function validateMeetupPayload(payload) {
  const errors = {};

  if (!payload.title) {
    errors.title = 'Please add a meetup title.';
  }

  if (!payload.image) {
    errors.image = 'Please add a valid cover image URL.';
  } else {
    try {
      new URL(payload.image);
    } catch {
      errors.image = 'Please add a valid cover image URL.';
    }
  }

  if (!payload.address) {
    errors.address = 'Please add a venue or meeting address.';
  }

  if (!payload.city) {
    errors.city = 'Please add a city to help people discover the meetup.';
  }

  if (!payload.description || payload.description.length < 20) {
    errors.description = 'Add at least 20 characters to explain the meetup experience.';
  }

  if (!payload.eventDate) {
    errors.eventDate = 'Choose an event date.';
  }

  if (!payload.organizerName) {
    errors.organizerName = 'Please add the organizer name.';
  }

  if (!payload.organizerEmail) {
    errors.organizerEmail = 'Please add an organizer contact email.';
  } else {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(payload.organizerEmail)) {
      errors.organizerEmail = 'Please add a valid organizer email.';
    }
  }

  return errors;
}

export function normalizeMeetupDocument(meetup = {}) {
  const sanitized = sanitizeMeetupPayload(meetup, meetup);

  return {
    id: meetup._id ? meetup._id.toString() : meetup.id,
    ...sanitized,
  };
}

export function getMeetupInitialValues(meetup = {}) {
  const sanitized = sanitizeMeetupPayload(meetup, meetup);

  return {
    ...sanitized,
    isFeatured: Boolean(sanitized.isFeatured),
  };
}
