import * as React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import { useComponentDetection } from '../../utils/cdq-utils';
import ReviewSection from '../ReviewSection';

const setFieldValueMock = jest.fn();

jest.mock('../../utils/cdq-utils', () => ({ useComponentDetection: jest.fn() }));

jest.mock('formik', () => ({
  ...(jest as any).requireActual('formik'),
  useFormikContext: jest.fn(() => ({
    ...(jest as any).requireActual('formik').useFormikContext(),
    setFieldValue: setFieldValueMock,
  })),
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  useChrome: () => ({
    helpTopics: { setActiveTopic: jest.fn(), enableTopics: jest.fn(), disableTopics: jest.fn() },
  }),
}));

const useComponentDetectionMock = useComponentDetection as jest.Mock;

describe('ReviewSection', () => {
  it('should handle waiting on cdq', async () => {
    useComponentDetectionMock.mockReturnValue([[], false]);
    const result = formikRenderer(<ReviewSection />, { source: { git: {} } });
    // force a re-render because formik is mocked
    result.rerender(<ReviewSection />);
    expect(screen.getByText('Detecting')).toBeInTheDocument();
  });

  it('should handle cdq loaded but no results', async () => {
    useComponentDetectionMock.mockReturnValue([[], true]);
    const result = formikRenderer(<ReviewSection />, { source: { git: {} } });
    // force a re-render because formik is mocked
    result.rerender(<ReviewSection />);
    expect(screen.getByText('Application details')).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should handle cdq errors', async () => {
    useComponentDetectionMock.mockReturnValue([[], false, 'error']);
    const result = formikRenderer(<ReviewSection />, { source: { git: {} } });
    // force a re-render because formik is mocked
    result.rerender(<ReviewSection />);
    expect(screen.getByText('Application details')).toBeInTheDocument();
    expect(screen.getByText('Components')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
