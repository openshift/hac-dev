import * as React from 'react';
import '@testing-library/jest-dom';
import { k8sPatchResource, useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ComponentKind } from '../../../types';
import { PAC_ANNOTATION, SAMPLE_ANNOTATION } from '../../../utils/component-utils';
import CustomizePipeline from '../CustomizePipelines';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  useK8sWatchResource: jest.fn(() => [[], true]),
  k8sPatchResource: jest.fn(),
}));

const useK8sWatchResourceMock = useK8sWatchResource as jest.Mock;
const k8sPatchResourceMock = k8sPatchResource as jest.Mock;

let componentCount = 1;
const createComponent = (pacValue?: 'done' | 'request', sample?: boolean): ComponentKind =>
  ({
    metadata: {
      name: `my-component-${componentCount++}`,
      annotations: {
        [PAC_ANNOTATION]: pacValue,
        [SAMPLE_ANNOTATION]: sample ? 'true' : undefined,
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

  it('should display upgrade status message', () => {
    expect(
      render(
        <CustomizePipeline components={[createComponent('request')]} onClose={() => {}} />,
      ).queryByText('0 of 1 component upgraded to custom build'),
    ).toBeInTheDocument();
  });

  it('should display upgrade status message for a single component', () => {
    expect(
      render(
        <CustomizePipeline components={[createComponent('request')]} onClose={() => {}} />,
      ).queryByText('0 of 1 component upgraded to custom build'),
    ).toBeInTheDocument();
  });

  it('should display upgrade status message for multiple components', () => {
    expect(
      render(
        <CustomizePipeline
          components={[createComponent(), createComponent(), createComponent(null, true)]}
          onClose={() => {}}
        />,
      ).queryByText('0 of 2 components upgraded to custom build'),
    ).toBeInTheDocument();
  });

  it('should display completed upgrade message', () => {
    useK8sWatchResourceMock.mockReturnValue([[{}], true]);
    expect(
      render(
        <CustomizePipeline components={[createComponent('done')]} onClose={() => {}} />,
      ).queryByText('1 of 1 component upgraded to custom build'),
    ).toBeInTheDocument();
  });
});
