import i18next from 'i18next';

export const getDuration = (seconds: number, long?: boolean): string => {
  if (seconds === 0) {
    return i18next.t('pipelines-plugin~less than a sec');
  }
  let sec = Math.round(seconds);
  let min = 0;
  let hr = 0;
  let duration = '';
  if (sec >= 60) {
    min = Math.floor(sec / 60);
    sec %= 60;
  }
  if (min >= 60) {
    hr = Math.floor(min / 60);
    min %= 60;
  }
  if (hr > 0) {
    duration += long ? `${hr} hour` : `${hr} h`;
    duration += ' ';
  }
  if (min > 0) {
    duration += long ? `${min} minute` : `${min} m`;
    duration += ' ';
  }
  if (sec > 0) {
    duration += long ? `${sec} second` : `${sec} s`;
  }

  return duration.trim();
};

export const calculateDuration = (startTime: string, endTime?: string) => {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : new Date().getTime();
  const durationInSeconds = (end - start) / 1000;
  return getDuration(durationInSeconds, true);
};
