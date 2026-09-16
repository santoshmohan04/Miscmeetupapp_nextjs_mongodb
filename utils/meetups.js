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
  if (calendarDateMatch && /T/.test(text)) {
    return calendarDateMatch[1];
  }

  return '';
}

function deriveCityFromAddress(address) {
  const segments = toText(address)
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);

  return segments.length > 1 ? segments[segments.length - 2] : segments[0] || '';
}

export function sanitizeMeetupPayload(input = {}, options = {}) {
  const { applyDefaults = true } = options;
  const categoryValue = toText(input.category);
  const eventTypeValue = toText(input.eventType);
  const eventDate = normalizeDate(input.eventDate);
  const address = toText(input.address);
  const category = categoryValue
    ? normalizeCategory(categoryValue)
    : applyDefaults
      ? DEFAULT_CATEGORY
      : '';
  const eventType = eventTypeValue
    ? normalizeFormat(eventTypeValue)
    : applyDefaults
      ? DEFAULT_FORMAT
      : '';
  const city = toText(input.city) || (applyDefaults ? deriveCityFromAddress(address) : '');
  const organizerName = toText(input.organizerName) || (applyDefaults ? 'Community host' : '');
  const organizerEmail = toText(input.organizerEmail);
  const attendeeCountValue = Number(input.attendeeCount ?? 0);
  const attendeeCount = Number.isFinite(attendeeCountValue)
    ? Math.max(0, Math.floor(attendeeCountValue))
    : 0;

  return {
    title: toText(input.title),
    image: toText(input.image),
    address,
    city,
    description: toText(input.description),
    category,
    eventType,
    eventDate,
    organizerName,
    organizerEmail,
    isFeatured: toBoolean(input.isFeatured),
    attendeeCount,
    createdAt: toText(input.createdAt) || new Date().toISOString(),
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
  const sanitized = sanitizeMeetupPayload(meetup, { applyDefaults: true });

  return {
    id: meetup._id ? meetup._id.toString() : meetup.id,
    _id: meetup._id ? meetup._id.toString() : meetup._id,
    ...sanitized,
  };
}

export function getMeetupInitialValues(meetup = {}) {
  const sanitized = sanitizeMeetupPayload(meetup, { applyDefaults: true });

  return {
    ...sanitized,
    isFeatured: Boolean(sanitized.isFeatured),
  };
}
