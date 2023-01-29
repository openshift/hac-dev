import * as React from 'react';
import '@testing-library/jest-dom';
import { k8sPatchResource, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ComponentKind } from '../../../types';
import { PAC_ANNOTATION } from '../../../utils/component-utils';
import CustomizePipeline from '../CustomizePipelines';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  k8sPatchResource: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const k8sPatchResourceMock = k8sPatchResource as jest.Mock;

const createComponent = (pacValue?: 'done' | 'request'): ComponentKind =>
  ({
    metadata: {
      name: 'my-component',
      annotations: {
        [PAC_ANNOTATION]: pacValue,
      },
    },
    spec: {
      source: {
        git: {
          url: 'https://github.com/org/test',
        },
      },
    },
  } as any as ComponentKind);

describe('CustomizePipeline', () => {
  afterEach(() => {
    k8sPatchResourceMock.mockClear();
    useK8sWatchResourceMock.mockClear();
  });

  it('should render opt in', () => {
    const result = render(
      <CustomizePipeline components={[createComponent()]} onClose={() => {}} />,
    );
    const button = result.queryByRole('button', { name: 'Send pull request' });
    expect(button).toBeInTheDocument();

    act(() => {
      button.click();
    });

    expect(k8sPatchResourceMock).toHaveBeenCalled();
  });

  it('should render sending pull request', () => {
    const result = render(
      <CustomizePipeline components={[createComponent('request')]} onClose={() => {}} />,
    );
    const button = result.getByRole('button', { name: /Sending pull request/ });
    expect(button).toBeInTheDocument();
  });

  it('should render pull request sent', () => {
    useK8sWatchResourceMock.mockReturnValue([[], true]);
    const result = render(
      <CustomizePipeline components={[createComponent('done')]} onClose={() => {}} />,
    );
    const button = result.queryByRole('link', { name: 'Merge in GitHub' });
    expect(button).toBeInTheDocument();
  });

  it('should render pull request merged', () => {
    useK8sWatchResourceMock.mockReturnValue([[{}], true]);
    const result = render(
      <CustomizePipeline components={[createComponent('done')]} onClose={() => {}} />,
    );
    const button = result.queryByRole('link', { name: 'Edit pipeline in GitHub' });
    expect(button).toBeInTheDocument();
  });
});
