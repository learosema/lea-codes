import dayjs from 'dayjs';

/** Converts the given date string to ISO8601 format. */
export default (dateString) => dayjs(dateString).toISOString();
