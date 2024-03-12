import * as React from 'react';
import '@testing-library/jest-dom';
import { act, fireEvent, screen } from '@testing-library/react';
import * as yup from 'yup';
import { namespaceRenderer } from '../../../../../utils/test-utils';
import { createRelease } from '../form-utils';
import { TriggerReleaseFormPage } from '../TriggerReleaseFormPage';

jest.mock('../../../../../utils/analytics', () => ({
  ...jest.requireActual<any>('../../../../../utils/analytics'),
  useTrackEvent: () => jest.fn,
}));

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest as any).requireActual('react-router-dom'),
  useLocation: jest.fn(() => ({})),
  Link: (props: any) => <a href={props.to}>{props.children}</a>,
  useNavigate: jest.fn(() => navigateMock),
}));

jest.mock('../form-utils', () => ({
  ...jest.requireActual<any>('../form-utils'),
  createRelease: jest.fn(),
  triggerReleaseFormSchema: yup.object(),
}));

jest.mock('../TriggerReleaseForm', () => ({
  TriggerReleaseForm: ({ handleSubmit, handleReset }) => (
    <>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleReset}>Reset</button>
    </>
  ),
}));

const triggerReleasePlanMock = createRelease as jest.Mock;

describe('TriggerReleaseFormPage', () => {
  it('should navigate on successful trigger', async () => {
    triggerReleasePlanMock.mockResolvedValue({ metadata: {}, spec: {} });
    namespaceRenderer(<TriggerReleaseFormPage />, 'test-ns', {
      workspace: 'test-ws',
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    });

    expect(triggerReleasePlanMock).toHaveBeenCalled();
    expect(triggerReleasePlanMock).toHaveBeenCalledWith(
      expect.objectContaining({
        description: '',
        labels: [{ key: '', value: '' }],
        references: '',
        releasePlan: '',
        snapshot: '',
        synopsis: '',
        topic: '',
      }),
      'test-ns',
      undefined,
    );
    expect(navigateMock).toHaveBeenCalledWith('/application-pipeline/release');
  });

  it('should navigate to release list on reset', async () => {
    namespaceRenderer(
      <TriggerReleaseFormPage releasePlan={{ metadata: {}, spec: {} } as any} />,
      'test-ns',
      {
        workspace: 'test-ws',
      },
    );

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    });

    expect(navigateMock).toHaveBeenCalledWith('/application-pipeline/release');
  });
});
