import * as React from 'react';
import { screen } from '@testing-library/react';
import { formikRenderer } from '../../../utils/test-utils';
import { ReviewSourceComponentCard } from '../ReviewSourceComponentCard';
import '@testing-library/jest-dom';

const containerImageComponent = {
  name: 'demo-latest',
  source: {},
  containerImage: 'quay.io/sbudhwar/demo:latest',
};

const gitRepoComponent = {
  name: 'java-springboot',
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
};

describe('ReviewSourceComponentCard', () => {
  it('should render git url if component has git repo', () => {
    formikRenderer(<ReviewSourceComponentCard component={gitRepoComponent} />);

    expect(
      screen.getByText(
        'https://github.com/devfile-samples/devfile-sample-java-springboot-basic.git',
      ),
    ).toBeInTheDocument();
  });

  it('should render container image if component has container image', () => {
    formikRenderer(<ReviewSourceComponentCard component={containerImageComponent} />);

    expect(screen.getByText('quay.io/sbudhwar/demo:latest')).toBeInTheDocument();
  });
});
