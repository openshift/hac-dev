import { mockEnterpriseContractUIData } from '../../__data__/mockEnterpriseContractLogsJson';
import { UIEnterpriseContractData } from '../../types';
import { getSortColumnFuntion } from '../EnterpriseContractTable';

describe('getSortColumnFuntion', () => {
  it('should sort alphabetically based on component', () => {
    const mockData = [
      ...mockEnterpriseContractUIData,
      {
        title: 'No tasks run',
        description:
          'This policy enforces that at least one Task is present in the PipelineRun attestation.',
        status: 'Success',
        component: 'abcd-devfile-sample-python-basic-aw05',
        collection: ['minimal'],
      },
    ] as UIEnterpriseContractData[];
    const sortedData = mockData.sort(getSortColumnFuntion('component', 'asc'));
    expect(sortedData[0].component).toEqual('abcd-devfile-sample-python-basic-aw05');
    expect(sortedData[1].component).toEqual('devfile-sample-python-basic-aw05');
    const descSortedData = mockData.sort(getSortColumnFuntion('component', 'desc'));
    expect(descSortedData[2].component).toEqual('abcd-devfile-sample-python-basic-aw05');
    expect(descSortedData[0].component).toEqual('devfile-sample-python-basic-aw05');
  });

  it('should sort column based on status priority', () => {
    const mockData = [
      ...mockEnterpriseContractUIData,
      {
        title: 'No tasks run',
        description:
          'This policy enforces that at least one Task is present in the PipelineRun attestation.',
        status: 'Warning',
        component: 'abcd-devfile-sample-python-basic-aw05',
        collection: ['minimal'],
      },
    ] as UIEnterpriseContractData[];
    const sortedData = mockData.sort(getSortColumnFuntion('status', 'asc'));
    expect(sortedData[0].status).toEqual('Failed');
    expect(sortedData[1].status).toEqual('Warning');
    expect(sortedData[2].status).toEqual('Success');
    const descSortedData = mockData.sort(getSortColumnFuntion('status', 'desc'));
    expect(descSortedData[2].status).toEqual('Failed');
    expect(descSortedData[1].status).toEqual('Warning');
    expect(descSortedData[0].status).toEqual('Success');
  });
});
