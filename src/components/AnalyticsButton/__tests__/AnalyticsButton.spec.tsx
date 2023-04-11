import * as React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { TrackEvents } from '../../../utils/analytics';
import AnalyticsButton from '../AnalyticsButton';

const trackMock = jest.fn();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    analytics: {
      track: trackMock,
    },
  }),
}));

describe('AnalyticsButton', () => {
  it('should track button click', () => {
    const result = render(
      <AnalyticsButton analytics={{ current_path: '/foo/bar', link_name: 'foo' }} />,
    );
    result.getByRole('button').click();
    expect(trackMock).toHaveBeenCalledWith(TrackEvents.ButtonClicked, {
      current_path: '/foo/bar',
      link_name: 'foo',
    });
  });

  it('should callback original onClick handler', () => {
    const onClickMock = jest.fn();
    const result = render(
      <AnalyticsButton onClick={onClickMock} analytics={{ link_name: 'foo' }} />,
    );
    result.getByRole('button').click();
    expect(onClickMock).toHaveBeenCalled();

    onClickMock.mockClear();
    result.rerender(<AnalyticsButton onClick={onClickMock} />);
    result.getByRole('button').click();
    expect(onClickMock).toHaveBeenCalled();
  });
});
