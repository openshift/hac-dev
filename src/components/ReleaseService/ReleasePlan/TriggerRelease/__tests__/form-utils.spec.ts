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
          { issueKey: 'RHTAP-5560', summary: 'summary1', url: 'test-url' },
          { issueKey: 'RHTAP-5561', summary: 'summary2', url: 'test-url2' },
          { issueKey: 'RHTAP-5562', summary: 'summary3', url: 'test-url2' },
        ],
        labels: [],
      },
      'test-ns',
    );

    const advisoryIssues = result.spec.data.releaseNotes.issues;
    expect(advisoryIssues.length).toEqual(3);
    expect(advisoryIssues[0]).toEqual(
      expect.objectContaining({
        issueKey: 'RHTAP-5560',
        url: 'test-url',
        summary: 'summary1',
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
          { issueKey: 'cve1', components: ['a', 'b'], url: 'test-url' },
          { issueKey: 'cve2', components: ['c', 'd'], url: 'test-url2' },
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
        components: ['a', 'b'],
      }),
    );
  });
});
