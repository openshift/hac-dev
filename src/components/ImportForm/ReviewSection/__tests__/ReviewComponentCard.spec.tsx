import * as React from 'react';
import { act, configure, fireEvent, screen } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import { useComponentDetection } from '../../utils/cdq-utils';
import { useDevfileSamples } from '../../utils/useDevfileSamples';
import { ReviewComponentCard } from '../ReviewComponentCard';
import '@testing-library/jest-dom';

jest.mock('../../utils/cdq-utils', () => ({ useComponentDetection: jest.fn() }));

jest.mock('../../utils/useDevfileSamples', () => ({
  useDevfileSamples: jest.fn(() => []),
}));

configure({ testIdAttribute: 'data-test' });

const useComponentDetectionMock = useComponentDetection as jest.Mock;
const useDevfileSamplesMock = useDevfileSamples as jest.Mock;

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

describe('ReviewComponentCard', () => {
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
      screen.getByText(
        'https://github.com/devfile-samples/devfile-sample-java-springboot-basic.git',
      ),
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

  it('should show expandable config when components are detected', async () => {
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
  });

  it('should show config options expanded by default', async () => {
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

    const configExpand = screen.getByTestId('config-expander');
    expect(configExpand).toBeInTheDocument();
    const expandButton = configExpand.querySelector('.pf-c-expandable-section__toggle');
    expect(expandButton).toBeInTheDocument();
    expect(screen.queryByText('Docker file path')).toBeVisible();

    await act(async () => {
      fireEvent.click(expandButton);
    });
    expect(screen.queryByText('Docker file path')).not.toBeVisible();
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
});
