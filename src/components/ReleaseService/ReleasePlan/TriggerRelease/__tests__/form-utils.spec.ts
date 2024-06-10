import { k8sCreateResource } from '@openshift/dynamic-plugin-sdk-utils';
import '@testing-library/jest-dom';
import { createRelease } from '../form-utils';

jest.mock('@openshift/dynamic-plugin-sdk-utils', () => ({
  k8sCreateResource: jest.fn(),
}));

const k8sCreateMock = k8sCreateResource as jest.Mock;

describe('triggerReleasePlan', () => {
  beforeEach(() => {
    k8sCreateMock.mockImplementation((obj) => obj.resource);
  });

  it('should add snapshot & releasePlan to spec.snapshot & spec.releasePlan', async () => {
    const result = await createRelease(
      {
        snapshot: 'test-snapshot',
        releasePlan: 'test-releasePlan',
        synopsis: null,
        topic: null,
        references: null,
        labels: [],
      },
      'test-ns',
    );
    expect(result.spec).toEqual(
      expect.objectContaining({
        snapshot: 'test-snapshot',
        releasePlan: 'test-releasePlan',
      }),
    );
  });

  it('should add Synopsis, Topic, Description, Reference to spec.data', async () => {
    const result = await createRelease(
      {
        snapshot: 'test-plan',
        synopsis: 'synopsis',
        releasePlan: 'test-releasePlan',
        description: 'short description',
        topic: 'topic of release',
        references: 'references',
        labels: [],
      },
      'test-ns',
    );
    expect(result.spec.data.releaseNotes).toEqual(
      expect.objectContaining({
        synopsis: 'synopsis',
        topic: 'topic of release',
        description: 'short description',
      }),
    );
  });

  it('should add Bug Data to advisory', async () => {
    const result = await createRelease(
      {
        snapshot: 'test-plan',
        synopsis: 'synopsis',
        releasePlan: 'test-releasePlan',
        description: 'short description',
        topic: 'topic of release',
        references: 'references',
        issues: [
          { key: 'RHTAP-5560', summary: 'summary1', url: 'test-url' },
          { key: 'RHTAP-5561', summary: 'summary2', url: 'test-url2' },
          { key: 'RHTAP-5562', summary: 'summary3', url: 'test-url2' },
        ],
        labels: [],
      },
      'test-ns',
    );

    const advisoryIssues = result.spec.data.releaseNotes.fixed;
    expect(advisoryIssues.length).toEqual(3);
    expect(advisoryIssues[0]).toEqual(
      expect.objectContaining({
        id: 'RHTAP-5560',
        source: 'test-url',
      }),
    );
  });

  it('should add CVE Data to advisory', async () => {
    const result = await createRelease(
      {
        snapshot: 'test-plan',
        synopsis: 'synopsis',
        releasePlan: 'test-releasePlan',
        description: 'short description',
        topic: 'topic of release',
        references: 'references',
        cves: [
          {
            issueKey: 'cve1',
            components: [
              { name: 'a', packages: ['p3', 'p4'] },
              { name: 'b', packages: ['p1', 'p2'] },
            ],
            url: 'test-url',
          },
          {
            issueKey: 'cve2',
            components: [
              { name: 'c', packages: ['p5', 'p6'] },
              { name: 'd', packages: ['p7', 'p8'] },
            ],
            url: 'test-url2',
          },
        ],
        labels: [],
      },
      'test-ns',
    );

    const advisoryCVE = result.spec.data.releaseNotes.cves;
    expect(advisoryCVE.length).toEqual(2);
    expect(advisoryCVE[0]).toEqual(
      expect.objectContaining({
        issueKey: 'cve1',
        url: 'test-url',
        components: [
          { name: 'a', packages: ['p3', 'p4'] },
          { name: 'b', packages: ['p1', 'p2'] },
        ],
      }),
    );
  });
});
