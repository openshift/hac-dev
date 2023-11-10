import * as React from 'react';
import { Button, ButtonProps } from '@patternfly/react-core';
import { AnalyticsButtonProperties, useTrackEvent, TrackEvents } from '../../utils/analytics';

const AnalyticsButton: React.FC<
  React.PropsWithChildren<
    ButtonProps & {
      analytics?: AnalyticsButtonProperties;
    }
  >
> = ({ onClick, analytics, ...props }) => {
  const track = useTrackEvent();
  return (
    <Button
      {...props}
      onClick={
        analytics
          ? (...args) => {
              track(TrackEvents.ButtonClicked, analytics);
              onClick?.(...args);
            }
          : onClick
      }
    />
  );
};

export default AnalyticsButton;
