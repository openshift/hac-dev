import dayjs from 'dayjs';

export const localizeTimeStamp = (timestamp: string): string =>
  dayjs(new Date(timestamp)).format('MMMM DD, YYYY, h:mm A');
