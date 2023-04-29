import * as React from 'react';
import '@testing-library/jest-dom';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { act, configure, screen } from '@testing-library/react';
import { useField } from 'formik';
import { formikRenderer } from '../../../../utils/test-utils';
import { useComponentDetection } from '../../utils/cdq-utils';
import { useDevfileSamples } from '../../utils/useDevfileSamples';
import { ReviewComponentCard } from '../ReviewComponentCard';

jest.mock('../../utils/cdq-utils', () => ({ useComponentDetection: jest.fn() }));

jest.mock('../../utils/useDevfileSamples', () => ({
  useDevfileSamples: jest.fn(() => []),
}));

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(),
  getActiveWorkspace: jest.fn(() => 'test-ws'),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../utils/useDevfileSamples', () => ({
  useDevfileSamples: jest.fn(() => []),
}));

jest.mock('formik', () => ({
  ...(jest as any).requireActual('formik'),
  useField: jest.fn(),
}));

configure({ testIdAttribute: 'data-test' });

const useComponentDetectionMock = useComponentDetection as jest.Mock;
const useDevfileSamplesMock = useDevfileSamples as jest.Mock;
const useFieldMock = useField as jest.Mock;

const containerImageComponent = {
  componentStub: {
    componentName: 'demo-latest',
    application: 'test-app',
    source: {},
    containerImage: 'quay.io/sbudhwar/demo:latest',
  },
};

const gitRepoComponent = {
  componentStub: {
    componentName: 'java-springboot',
    application: 'test-app',
    source: {
      git: {
        url: 'https://github.com/devfile-samples/devfile-sample-java-springboot-basic.git',
        dockerfileUrl: './Dockerfile',
      },
    },
    envs: [
      {
        name: 'DEBUG_PORT',
        value: '5858',
      },
    ],
  },
};

const watchResourceMock = useK8sWatchResource as jest.Mock;

describe('ReviewComponentCard', () => {
  let onEditHandler;
  beforeEach(() => {
    onEditHandler = jest.fn();
    useFieldMock.mockReturnValue([
      { value: '', onChange: jest.fn() },
      { value: '' },
      { setValue: onEditHandler },
    ]);
    watchResourceMock.mockReturnValue([[], true]);
  });

  const {
    componentStub: { componentName },
  } = gitRepoComponent;
  it('should render git url if component has git repo', () => {
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(
      <ReviewComponentCard
        detectedComponent={gitRepoComponent}
        detectedComponentIndex={0}
        showRuntimeSelector
      />,
      { isDetected: true, source: { git: {} } },
    );

    expect(
      screen.getByText('devfile-samples/devfile-sample-java-springboot-basic'),
    ).toBeInTheDocument();
  });

  it('should render container image if component has container image', () => {
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(
      <ReviewComponentCard
        detectedComponent={containerImageComponent}
        detectedComponentIndex={0}
        showRuntimeSelector
      />,
      { isDetected: true, source: { git: {} } },
    );

    expect(screen.getByText('quay.io/sbudhwar/demo:latest')).toBeInTheDocument();
  });

  it('should show build and deploy config options when components are detected', async () => {
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(
      <ReviewComponentCard
        detectedComponent={gitRepoComponent}
        detectedComponentIndex={0}
        showRuntimeSelector
      />,
      { isDetected: true, source: { git: {} } },
    );
    await act(async () => screen.getByTestId(`${componentName}-toggle-button`).click());

    expect(screen.getByText('Build & deploy configuration')).toBeInTheDocument();

    expect(screen.queryByText('Dockerfile')).toBeVisible();
    expect(screen.queryByText('Target port')).toBeVisible();
    expect(screen.queryByText('Instances')).toBeVisible();
  });

  it('should not hide expandable config when components are not detected', async () => {
    useComponentDetectionMock.mockReturnValue([]);
    formikRenderer(
      <ReviewComponentCard
        detectedComponent={gitRepoComponent}
        detectedComponentIndex={0}
        showRuntimeSelector
      />,
      { source: { git: {} } },
    );
    await act(async () => screen.getByTestId(`${componentName}-toggle-button`).click());
    expect(screen.queryByText('Build & deploy configuration')).toBeInTheDocument();
  });

  it('should not show runtime selector when not specified', async () => {
    useComponentDetectionMock.mockReturnValue([]);
    useDevfileSamplesMock.mockReturnValue([[], true]);
    formikRenderer(
      <ReviewComponentCard detectedComponent={gitRepoComponent} detectedComponentIndex={0} />,
      { isDetected: true, source: { git: {} } },
    );
    expect(screen.queryByRole('button', { name: 'Select a runtime' })).not.toBeInTheDocument();
  });

  it('should show input field for component name by default', async () => {
    useComponentDetectionMock.mockReturnValue([]);

    formikRenderer(
      <ReviewComponentCard
        detectedComponent={gitRepoComponent}
        detectedComponentIndex={0}
        showRuntimeSelector
      />,
      { isDetected: true, source: { git: {} } },
    );
    screen.getByLabelText('Component name');
  });

  it('should show disabled input field for component name if in edit mode', async () => {
    useComponentDetectionMock.mockReturnValue([]);

    formikRenderer(
      <ReviewComponentCard
        detectedComponent={gitRepoComponent}
        detectedComponentIndex={0}
        showRuntimeSelector
        editMode
      />,
      { isDetected: true, source: { git: {} } },
    );
    expect(screen.getByLabelText('Component name')).toBeDisabled();
  });
});
