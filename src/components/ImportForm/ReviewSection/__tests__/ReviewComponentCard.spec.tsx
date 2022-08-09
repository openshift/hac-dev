import * as React from 'react';
import { screen } from '@testing-library/react';
import { formikRenderer } from '../../../../utils/test-utils';
import { ReviewComponentCard } from '../ReviewComponentCard';
import '@testing-library/jest-dom';

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
  it('should render git url if component has git repo', () => {
    formikRenderer(
      <ReviewComponentCard detectedComponent={gitRepoComponent} detectedComponentIndex={0} />,
      { components: [gitRepoComponent] },
    );

    expect(
      screen.getByText(
        'https://github.com/devfile-samples/devfile-sample-java-springboot-basic.git',
      ),
    ).toBeInTheDocument();
  });

  it('should render container image if component has container image', () => {
    formikRenderer(
      <ReviewComponentCard
        detectedComponent={containerImageComponent}
        detectedComponentIndex={0}
      />,
      { components: [containerImageComponent] },
    );

    expect(screen.getByText('quay.io/sbudhwar/demo:latest')).toBeInTheDocument();
  });
});
