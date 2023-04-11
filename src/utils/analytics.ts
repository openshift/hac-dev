import * as React from 'react';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

type JSONValue = string | number | boolean | JSONObject | JSONArray;

interface JSONObject {
  [x: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

export type AnalyticsProperties = JSONObject;

export type AnalyticsButtonProperties = {
  link_name: string;
  link_location?: string;
} & AnalyticsProperties;

// common events
export const TrackEvents = {
  ButtonClicked: 'Button Clicked',
};

export const useTrackEvent = () => {
  const { analytics } = useChrome();
  return React.useCallback(
    (event: string, properties: AnalyticsProperties) => {
      if (process.env.NODE_ENV !== 'development') {
        analytics.track(event, { current_path: window.location.pathname, ...properties });
      } else {
        // eslint-disable-next-line no-console
        console.log('analytics.track', event, properties);
      }
    },
    [analytics],
  );
};
