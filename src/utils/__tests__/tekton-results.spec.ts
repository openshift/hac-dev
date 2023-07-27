import { commonFetchJSON } from '@openshift/dynamic-plugin-sdk-utils';
import {
  AND,
  createTektonResultsUrl,
  DataType,
  decodeValue,
  decodeValueJson,
  EQ,
  expressionsToFilter,
  TektonResultsOptions,
  getFilteredRecord,
  getPipelineRuns,
  getTaskRuns,
  labelsToFilter,
  NEQ,
  OR,
  RecordsList,
  getTaskRunLog,
} from '../tekton-results';

jest.mock('@openshift/dynamic-plugin-sdk-utils');

const commonFetchJSONMock = commonFetchJSON as unknown as jest.Mock;

const sampleOptions: TektonResultsOptions = {
  filter: 'count > 1',
  selector: {
    matchLabels: {
      test: 'a',
    },
    matchExpressions: [
      {
        key: 'mtest',
        operator: 'Equals',
        values: ['ma'],
      },
    ],
  },
};

const mockEmptyRecordsList: RecordsList = { nextPageToken: null, records: [] };

const mockRecordsList = {
  nextPageToken: null,
  records: [
    {
      data: {
        // {"key":"test1"}
        value: 'eyJrZXkiOiJ0ZXN0MSJ9',
      },
    },
    {
      data: {
        // {"key":"test2"}
        value: 'eyJrZXkiOiJ0ZXN0MiJ9',
      },
    },
  ],
} as RecordsList;

const mockResponseCheck = [[{ key: 'test1' }, { key: 'test2' }], mockRecordsList] as [
  any[],
  RecordsList,
];

const mockLogsRecordsList = {
  nextPageToken: null,
  records: [
    {
      name: 'test-ns/results/b9f43742-3675-4a71-8d73-31c5f5080a74/records/113298cc-07f9-3ce0-85e3-5cf635eacf62',
      data: {
        value: '',
      },
    },
  ],
} as RecordsList;

const mockLogResponse = {
  result: {
    // 'sample log'
    data: 'c2FtcGxlIGxvZw==',
  },
};

describe('tekton-results', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('decoding', () => {
    it('should decode base64', () => {
      expect(decodeValue('eyJoZWxsbyI6IndvcmxkIn0=')).toEqual('{"hello":"world"}');
    });
    it('should decode base64 to JSON', () => {
      expect(decodeValueJson('eyJoZWxsbyI6IndvcmxkIn0=')).toStrictEqual({ hello: 'world' });
    });
  });

  describe('filter helpers', () => {
    it('should AND filters', () => {
      expect(AND()).toEqual('');
      expect(AND('a')).toEqual('a');
      expect(AND('a', 'b', 'c')).toEqual('a && b && c');
    });

    it('should OR filters', () => {
      expect(OR()).toEqual('');
      expect(OR('a')).toEqual('a');
      expect(OR('a', 'b', 'c')).toEqual('(a || b || c)');
    });

    it('should create equal filters', () => {
      expect(EQ('left', 'right')).toEqual('left == "right"');
    });

    it('should create not equal filters', () => {
      expect(NEQ('left', 'right')).toEqual('left != "right"');
    });

    it('should convert label selector to filters', () => {
      expect(labelsToFilter()).toEqual('');
      expect(labelsToFilter({})).toEqual('');
      expect(labelsToFilter({ foo: 'bar', 'foo/bar.com': 'test' })).toEqual(
        'data.metadata.labels["foo"] == "bar" && data.metadata.labels["foo/bar.com"] == "test"',
      );
    });
  });
  describe('expressionsToFilter', () => {
    it('should convert empty expressions', () => {
      expect(expressionsToFilter([])).toEqual('');
      expect(() =>
        expressionsToFilter([
          {
            key: 'test',
            operator: 'unknown',
          },
        ]),
      ).toThrow();
    });
    it('should convert Exists operator', () => {
      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'Exists',
          },
        ]),
      ).toStrictEqual('data.metadata.labels.contains("test")');
    });

    it('should convert DoesNotExist operator', () => {
      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'DoesNotExist',
          },
        ]),
        // TODO
        // ).toStrictEqual('!data.metadata.labels.contains("test")');
      ).toStrictEqual('');
    });

    it('should convert NotIn operator', () => {
      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'NotIn',
          },
        ]),
      ).toStrictEqual('');

      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'NotIn',
            values: ['a', 'b'],
          },
        ]),
      ).toStrictEqual('data.metadata.labels["test"] != "a" && data.metadata.labels["test"] != "b"');
    });

    it('should convert In operator', () => {
      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'In',
          },
        ]),
      ).toStrictEqual('');

      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'In',
            values: ['a', 'b'],
          },
        ]),
      ).toStrictEqual('data.metadata.labels["test"] in ["a","b"]');
    });

    it('should convert Equals operator', () => {
      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'Equals',
          },
        ]),
      ).toStrictEqual('');

      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'Equals',
            values: ['a', 'b'],
          },
        ]),
      ).toStrictEqual('data.metadata.labels["test"] == "a"');
    });

    it('should convert NotEquals operator', () => {
      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'NotEquals',
          },
        ]),
      ).toStrictEqual('');

      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'NotEquals',
            values: ['a', 'b'],
          },
        ]),
      ).toStrictEqual('data.metadata.labels["test"] != "a"');
    });

    it('should convert NotEqual operator', () => {
      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'NotEqual',
          },
        ]),
      ).toStrictEqual('');

      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'NotEqual',
            values: ['a', 'b'],
          },
        ]),
      ).toStrictEqual('data.metadata.labels["test"] != "a"');
    });

    it('should convert GreaterThan operator', () => {
      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'GreaterThan',
          },
        ]),
      ).toStrictEqual('');

      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'GreaterThan',
            values: ['5'],
          },
        ]),
      ).toStrictEqual('data.metadata.labels["test"] > 5');
    });

    it('should convert LessThan operator', () => {
      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'LessThan',
          },
        ]),
      ).toStrictEqual('');

      expect(
        expressionsToFilter([
          {
            key: 'test',
            operator: 'LessThan',
            values: ['5'],
          },
        ]),
      ).toStrictEqual('data.metadata.labels["test"] < 5');
    });
  });

  describe('createTektonResultsUrl', () => {
    it('should create minimal URL', () => {
      expect(createTektonResultsUrl('test-ws', 'test-ns', DataType.PipelineRun)).toEqual(
        '/plugins/tekton-results/workspaces/test-ws/apis/results.tekton.dev/v1alpha2/parents/test-ns/results/-/records?order_by=create_time+desc&page_size=50&filter=data_type+%3D%3D+%22tekton.dev%2Fv1beta1.PipelineRun%22',
      );
      expect(createTektonResultsUrl('test-ws', 'test-ns', DataType.TaskRun)).toEqual(
        '/plugins/tekton-results/workspaces/test-ws/apis/results.tekton.dev/v1alpha2/parents/test-ns/results/-/records?order_by=create_time+desc&page_size=50&filter=data_type+%3D%3D+%22tekton.dev%2Fv1beta1.TaskRun%22',
      );
    });

    it('should create URL with nextPageToken', () => {
      expect(
        createTektonResultsUrl(
          'test-ws',
          'test-ns',
          DataType.PipelineRun,
          null,
          null,
          'test-token',
        ),
      ).toContain('page_token=test-token');
    });

    it('should create URL with filter', () => {
      expect(createTektonResultsUrl('test-ws', 'test-ns', DataType.PipelineRun, 'foo=bar')).toEqual(
        '/plugins/tekton-results/workspaces/test-ws/apis/results.tekton.dev/v1alpha2/parents/test-ns/results/-/records?order_by=create_time+desc&page_size=50&filter=data_type+%3D%3D+%22tekton.dev%2Fv1beta1.PipelineRun%22+%26%26+foo%3Dbar',
      );
    });

    it('should create URL with page size', () => {
      // default page size
      expect(createTektonResultsUrl('test-ws', 'test-ns', DataType.PipelineRun)).toContain(
        'page_size=50',
      );
      // min page size
      expect(
        createTektonResultsUrl('test-ws', 'test-ns', DataType.PipelineRun, '', {
          pageSize: 1,
        }),
      ).toContain('page_size=5');

      // min page size
      expect(
        createTektonResultsUrl('test-ws', 'test-ns', DataType.PipelineRun, '', {
          pageSize: 11000,
        }),
      ).toContain('page_size=10000');
    });

    it('should create URL using limit to affect page size', () => {
      expect(
        createTektonResultsUrl('test-ws', 'test-ns', DataType.PipelineRun, '', {
          pageSize: 10,
          limit: 5,
        }),
      ).toContain('page_size=5');
    });

    it('should create URL merging filters', () => {
      expect(
        createTektonResultsUrl(
          'test-ws',
          'test-ns',
          DataType.PipelineRun,
          'foo=bar',
          sampleOptions,
        ),
      ).toContain(
        'filter=data_type+%3D%3D+%22tekton.dev%2Fv1beta1.PipelineRun%22+%26%26+foo%3Dbar+%26%26+data.metadata.labels%5B%22test%22%5D+%3D%3D+%22a%22+%26%26+data.metadata.labels%5B%22mtest%22%5D+%3D%3D+%22ma%22+%26%26+count+%3E+1',
      );
    });
  });

  describe('getFilteredRecord', () => {
    it('should return cached value', async () => {
      commonFetchJSONMock.mockReturnValue(mockEmptyRecordsList);

      await getFilteredRecord('test-ws', 'test-ns', DataType.PipelineRun);
      await getFilteredRecord('test-ws', 'test-ns', DataType.PipelineRun);
      expect(commonFetchJSONMock).toHaveBeenCalledTimes(2);

      commonFetchJSONMock.mockClear();

      await getFilteredRecord(
        'test-ws',
        'test-ns',
        DataType.PipelineRun,
        null,
        null,
        null,
        'cache-key',
      );
      await getFilteredRecord(
        'test-ws',
        'test-ns',
        DataType.PipelineRun,
        null,
        null,
        null,
        'cache-key',
      );
      expect(commonFetchJSONMock).toHaveBeenCalledTimes(1);
    });

    it('should return empty list for 404 errors', async () => {
      commonFetchJSONMock.mockImplementation(() => {
        throw {
          code: 404,
        };
      });
      const result = await getFilteredRecord('test-ws', 'test-ns', DataType.PipelineRun);
      expect(result).toEqual([[], { nextPageToken: null, records: [] }]);
    });

    it('should throw error when non 404 error', async () => {
      commonFetchJSONMock.mockImplementation(() => {
        throw {
          code: 502,
        };
      });
      await expect(
        getFilteredRecord('test-ws', 'test-ns', DataType.PipelineRun),
      ).rejects.toBeTruthy();
    });

    it('should return record list and decoded value', async () => {
      commonFetchJSONMock.mockReturnValue(mockRecordsList);
      expect(await getFilteredRecord('test-ws', 'test-ns', DataType.PipelineRun)).toEqual(
        mockResponseCheck,
      );
    });

    it('should return record list and decoded value', async () => {
      commonFetchJSONMock.mockReturnValue(mockRecordsList);
      expect(
        await getFilteredRecord('test-ws', 'test-ns', DataType.PipelineRun, null, { limit: 1 }),
      ).toEqual([
        [mockResponseCheck[0][0]],
        {
          nextPageToken: null,
          records: [mockResponseCheck[1].records[0]],
        },
      ]);
    });
  });

  describe('getPipelineRuns', () => {
    it('should return record list and decoded value', async () => {
      commonFetchJSONMock.mockReturnValue(mockRecordsList);
      expect(await getPipelineRuns('test-ws', 'test-ns')).toEqual(mockResponseCheck);
    });

    it('should query tekton results with options', async () => {
      await getPipelineRuns('test-ws', 'test-ns', sampleOptions, 'test-token');
      expect(commonFetchJSONMock).toHaveBeenCalledWith(
        '/plugins/tekton-results/workspaces/test-ws/apis/results.tekton.dev/v1alpha2/parents/test-ns/results/-/records?order_by=create_time+desc&page_size=50&page_token=test-token&filter=data_type+%3D%3D+%22tekton.dev%2Fv1beta1.PipelineRun%22+%26%26+data.metadata.labels%5B%22test%22%5D+%3D%3D+%22a%22+%26%26+data.metadata.labels%5B%22mtest%22%5D+%3D%3D+%22ma%22+%26%26+count+%3E+1',
      );
    });
  });

  describe('getTaskRuns', () => {
    it('should return record list and decoded value', async () => {
      commonFetchJSONMock.mockReturnValue(mockRecordsList);
      expect(await getTaskRuns('test-ws', 'test-ns')).toEqual(mockResponseCheck);
    });

    it('should query tekton results with options', async () => {
      await getTaskRuns('test-ws', 'test-ns', sampleOptions, 'test-token');
      expect(commonFetchJSONMock).toHaveBeenCalledWith(
        '/plugins/tekton-results/workspaces/test-ws/apis/results.tekton.dev/v1alpha2/parents/test-ns/results/-/records?order_by=create_time+desc&page_size=50&page_token=test-token&filter=data_type+%3D%3D+%22tekton.dev%2Fv1beta1.TaskRun%22+%26%26+data.metadata.labels%5B%22test%22%5D+%3D%3D+%22a%22+%26%26+data.metadata.labels%5B%22mtest%22%5D+%3D%3D+%22ma%22+%26%26+count+%3E+1',
      );
    });
  });

  describe('getTaskRunLog', () => {
    it('should return the latest component build task run', async () => {
      commonFetchJSONMock
        .mockReturnValueOnce(mockLogsRecordsList)
        .mockReturnValueOnce(Promise.resolve(mockLogResponse));
      expect(await getTaskRunLog('test-ws', 'test-ns', 'sample-task-run')).toEqual('sample log');
      expect(commonFetchJSONMock.mock.calls).toEqual([
        [
          '/plugins/tekton-results/workspaces/test-ws/apis/results.tekton.dev/v1alpha2/parents/test-ns/results/-/records?order_by=create_time+desc&page_size=5&filter=data_type+%3D%3D+%22results.tekton.dev%2Fv1alpha2.Log%22+%26%26+data.spec.resource.kind+%3D%3D+%22TaskRun%22+%26%26+data.spec.resource.name+%3D%3D+%22sample-task-run%22',
        ],
        [
          '/plugins/tekton-results/workspaces/test-ws/apis/results.tekton.dev/v1alpha2/parents/test-ns/results/b9f43742-3675-4a71-8d73-31c5f5080a74/logs/113298cc-07f9-3ce0-85e3-5cf635eacf62',
        ],
      ]);
    });

    it('should throw error 404 if record not found', async () => {
      commonFetchJSONMock.mockReturnValue(mockEmptyRecordsList);
      await expect(getTaskRunLog('test-ws', 'test-ns', 'sample-task-run')).rejects.toEqual({
        code: 404,
      });
    });
  });
});
