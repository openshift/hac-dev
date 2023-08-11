import * as React from 'react';
import '@testing-library/jest-dom';
import { configure, screen, waitFor } from '@testing-library/react';
import { useApplications } from '../../../../hooks/useApplications';
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

jest.mock('../../../../hooks/useApplications', () => ({
  useApplications: jest.fn(),
}));

jest.mock('../ReviewComponentCard', () => () => {
  return <div data-test="review-component-card" />;
});

jest.mock('git-url-parse', () => () => jest.fn(() => ({ toString: jest.fn() })));

configure({ testIdAttribute: 'data-test' });

const useComponentDetectionMock = useComponentDetection as jest.Mock;
const useApplicationsMock = useApplications as jest.Mock;

describe('ReviewSection', () => {
  beforeEach(() => {
    useApplicationsMock.mockReturnValue([[], true]);
  });

  it('should handle waiting on cdq', async () => {
    useComponentDetectionMock.mockReturnValue([[], false]);
    const result = formikRenderer(<ReviewSection />, { source: { git: {} } });
    // force a re-render because formik is mocked
    result.rerender(<ReviewSection />);
    screen.getByRole('progressbar');
    expect(screen.getByText('Detecting values...')).toBeInTheDocument();
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

  it('should show selected components when there are more than one components detected', async () => {
    useComponentDetectionMock.mockReturnValue([
      [
        {
          componentStub: {
            componentName: 'java-springboot1',
            application: 'test-app',
            source: {
              git: {
                url: 'https://github.com/devfile-samples/devfile-sample-java-springboot-basic.git',
                dockerfileUrl: './Dockerfile',
              },
            },
          },
          targetPortDetected: true,
        },
        {
          componentStub: {
            componentName: 'java-springboot2',
            application: 'test-app',
            source: {
              git: {
                url: 'https://github.com/devfile-samples/devfile-sample-java-springboot-basic.git',
                dockerfileUrl: './Dockerfile',
              },
            },
          },
          targetPortDetected: true,
        },
      ],
      true,
    ]);
    const result = formikRenderer(<ReviewSection />, {
      source: { git: {} },
      components: [{}, {}],
      selectedComponents: [true, true],
    });
    // force a re-render because formik is mocked
    result.rerender(<ReviewSection />);

    await waitFor(() => {
      expect(screen.getByText('Application details')).toBeInTheDocument();
      expect(screen.getByText('Components')).toBeInTheDocument();
      expect(screen.getByText('2 of 2 selected')).toBeInTheDocument();
      expect(screen.queryAllByTestId('review-component-card')).toHaveLength(2);
    });
  });

  it('should render only one component card if one component detected', async () => {
    useComponentDetectionMock.mockReturnValue([
      [
        {
          componentStub: {
            componentName: 'java-springboot1',
            application: 'test-app',
            source: {
              git: {
                url: 'https://github.com/devfile-samples/devfile-sample-java-springboot-basic.git',
                dockerfileUrl: './Dockerfile',
              },
            },
          },
          targetPortDetected: true,
        },
      ],
      true,
    ]);
    const result = formikRenderer(<ReviewSection />, {
      source: { git: {} },
      components: [{}],
    });
    // force a re-render because formik is mocked
    result.rerender(<ReviewSection />);

    await waitFor(() => {
      expect(screen.getByText('Application details')).toBeInTheDocument();
      expect(screen.getByText('Components')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.queryAllByTestId('review-component-card')).toHaveLength(1);
    });
  });
});
