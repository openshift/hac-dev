import * as React from 'react';
import '@testing-library/jest-dom';
import { screen, render, waitFor, configure } from '@testing-library/react';
import { testTaskRuns } from '../../../../components/TaskRunListView/__data__/mock-TaskRun-data';
import { useTRTaskRunLog } from '../../../../hooks/useTektonResults';
import { useScrollDirection } from '../../../hooks/scroll';
import { TektonTaskRunLog } from '../logs/TektonTaskRunLog';

jest.mock('../logs/Logs', () => (props) => {
  React.useEffect(() => {
    props.onComplete(props.container.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div>{`Logs - ${props.container.name}`}</div>;
});

jest.mock('../../../hooks/scroll', () => {
  const actual = jest.requireActual('../../../hooks/scroll');

  return {
    ...actual,
    useScrollDirection: jest.fn(),
  };
});

jest.mock('../../../../hooks/useTektonResults', () => ({
  useTRTaskRunLog: jest.fn(),
}));

const mockUseScrollDirection = useScrollDirection as jest.Mock;
const useTRTaskRunLogMock = useTRTaskRunLog as jest.Mock;

describe('TektonTaskRunLog', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());

    configure({ testIdAttribute: 'data-testid' });
    mockUseScrollDirection.mockReturnValue([null, () => {}]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading indicator', async () => {
    useTRTaskRunLogMock.mockReturnValue(['', false, null]);
    configure({ testIdAttribute: 'data-test' });

    render(<TektonTaskRunLog taskRun={testTaskRuns[0]} setCurrentLogsGetter={() => {}} />);

    await waitFor(() => {
      screen.getByTestId('loading-indicator');
    });
  });
  it('should display the tekton log results', async () => {
    useTRTaskRunLogMock.mockReturnValue(['tekton log results', true, null]);

    render(<TektonTaskRunLog taskRun={testTaskRuns[0]} setCurrentLogsGetter={() => {}} />);

    await waitFor(() => {
      screen.getByText('tekton log results');
    });
  });
});
