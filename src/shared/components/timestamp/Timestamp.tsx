import * as React from 'react';
import { Tooltip } from '@patternfly/react-core';
import { GlobeAmericasIcon } from '@patternfly/react-icons/dist/js/icons';
import classNames from 'classnames';
import * as dateTime from './datetime';

export type TimestampProps = {
  timestamp: string | number;
  isUnix?: boolean;
  simple?: boolean;
  omitSuffix?: boolean;
  className?: string;
};

const timestampFor = (mdate: Date, now: Date, omitSuffix: boolean) => {
  if (!dateTime.isValid(mdate)) {
    return '-';
  }

  const timeDifference = now.getTime() - mdate.getTime();
  if (omitSuffix) {
    return dateTime.fromNow(mdate, undefined, { omitSuffix: true });
  }

  // Show a relative time if within 10.5 minutes in the past from the current time.
  if (timeDifference > dateTime.maxClockSkewMS && timeDifference < 630000) {
    return dateTime.fromNow(mdate);
  }

  // Apr 23, 2021, 4:33 PM
  return dateTime.dateTimeFormatter.format(mdate);
};

export const Timestamp: React.FC<TimestampProps> = ({
  timestamp,
  isUnix,
  omitSuffix,
  simple,
  className,
}) => {
  // Check for null. If props.timestamp is null, it returns incorrect date and time of Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)
  if (!timestamp) {
    return <div>-</div>;
  }

  const mdate = isUnix ? new Date((timestamp as number) * 1000) : new Date(timestamp);

  const timeStamp = timestampFor(mdate, new Date(), omitSuffix);

  if (!dateTime.isValid(mdate)) {
    return <div>-</div>;
  }

  if (simple) {
    return <>{timeStamp}</>;
  }

  return (
    <div className={classNames('icon-and-text', className)}>
      <GlobeAmericasIcon className="icon-and-text__icon" />
      <Tooltip
        content={[
          <span className="nowrap" key={timestamp}>
            {dateTime.utcDateTimeFormatter.format(mdate)}
          </span>,
        ]}
      >
        <span data-test="timestamp">{timeStamp}</span>
      </Tooltip>
    </div>
  );
};

Timestamp.displayName = 'Timestamp';
