export const mockEnterpriseContractJSON = {
  components: [
    {
      containerImage: 'quay.io/redhat-appstudio/user-workload:GE4iZ-devfile-sample-1jik',
      name: 'devfile-sample-1jik',
      success: false,
      violations: [
        {
          msg: 'Image URL is not accessible: HEAD https://quay.io/v2/redhat-appstudio/user-workload/manifests/GE4iZ-devfile-sample-1jik: unexpected status code 404 Not Found (HEAD responses have no body, use GET for details)',
        },
      ],
    },
    {
      containerImage: 'quay.io/redhat-appstudio/user-workload:GE4iZ-devfile-sample-mhyd',
      name: 'devfile-sample-mhyd',
      success: false,
      violations: [
        {
          msg: 'Image URL is not accessible: HEAD https://quay.io/v2/redhat-appstudio/user-workload/manifests/GE4iZ-devfile-sample-mhyd: unexpected status code 404 Not Found (HEAD responses have no body, use GET for details)',
        },
      ],
    },
    {
      containerImage:
        'quay.io/redhat-appstudio/user-workload@sha256:8a234fb8f5785c29fd816e385a09e556a81e0e83d725b74085217e53ce3a7694',
      name: 'devfile-sample-python-basic-aw05',
      signatures: [
        {
          keyid: 'SHA256:ngBmVXGMzx/ZriUdur0MtnnIuZLYWY5tvPslf7LvE3c',
          metadata: {
            predicateBuildType: 'tekton.dev/v1beta1/TaskRun',
            predicateType: 'https://slsa.dev/provenance/v0.2',
            type: 'https://in-toto.io/Statement/v0.1',
          },
          sig: 'MEUCIGkfw3QL0DJJL4GDLWae+KBeWz9jnrkVR3tocY02LIw/AiEAoxprc3w/+ZZxPbd5hquS/jXY45RMuZMeOaUCVVCfbvQ=',
        },
        {
          keyid: 'SHA256:ngBmVXGMzx/ZriUdur0MtnnIuZLYWY5tvPslf7LvE3c',
          metadata: {
            predicateBuildType: 'tekton.dev/v1beta1/PipelineRun',
            predicateType: 'https://slsa.dev/provenance/v0.2',
            type: 'https://in-toto.io/Statement/v0.1',
          },
          sig: 'MEUCIGWVQ6j1JTvG6mN7WF80nrcsw6i/4PVTLglxqCdVoatrAiEA2Xy9ylICusarwfVRCb1zSdyI0Af+qp9G83MpeYM13jc=',
        },
      ],
      success: false,
      successes: [
        {
          metadata: {
            code: 'tasks.tasks_missing',
            collections: ['minimal'],
            description:
              'This policy enforces that at least one Task is present in the PipelineRun attestation.',
            title: 'No tasks run',
          },
          msg: 'Pass',
        },
      ],
      violations: [
        {
          metadata: {
            code: 'cve.missing_cve_scan_results',
            collections: ['minimal'],
            description:
              'The clair-scan task results have not been found in the SLSA Provenance attestation of the build pipeline.',
            ['effective_on']: '2022-01-01T00:00:00Z',
            title: 'Missing CVE scan results',
            solution: 'solution for failure',
          },
          msg: 'CVE scan results not found',
        },
      ],
    },
  ],
  key: '-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEWVUppvU1x8t866CQQSXbKpojoaTq\nimMnVnZ31e2ubZHKL1LdfgPG2gHIPeSeouTa8upOz9W+xxBFnA0X515Nsw==\n-----END PUBLIC KEY-----\n',
  policy: {
    configuration: {
      collections: ['minimal'],
      exclude: ['step_image_registries'],
    },
    description:
      'Use the policy rules from the "minimal" collection. This and other collections are defined in https://redhat-appstudio.github.io/docs.stonesoup.io/ec-policies/release_policy.html#_available_rule_collections The minimal collection is a small set of policy rules that should be easy to pass for brand new Stonesoup users. If a different policy configuration is desired, this resource can serve as a starting point. See the docs on how to include and exclude rules https://redhat-appstudio.github.io/docs.stonesoup.io/ec-policies/policy_configuration.html#_including_and_excluding_rules\n',
    publicKey: 'k8s://tekton-chains/public-key',
    sources: [
      {
        data: [
          'oci::quay.io/hacbs-contract/ec-policy-data:git-d995f67@sha256:eb713f2c0d9c944cbbb298a2c8a0ca1e5a741d149f033b145296d6f550ebd10b',
        ],
        name: 'Release Policies',
        policy: [
          'oci::quay.io/hacbs-contract/ec-release-policy:git-d995f67@sha256:9d2cffae5ed8a541b4bff1acbaa9bb0b42290214de969e515e78f97b8cf8ff51',
        ],
      },
    ],
  },
  success: false,
  Error: 'success criteria not met',
};

export const mockEnterpriseContractUIData = [
  {
    title: 'Missing CVE scan results',
    description:
      'The clair-scan task results have not been found in the SLSA Provenance attestation of the build pipeline.',
    status: 'Failed',
    timestamp: '2022-01-01T00:00:00Z',
    component: 'devfile-sample-python-basic-aw05',
    msg: 'CVE scan results not found',
    solution: 'solution for failure',
    collection: ['minimal'],
  },
  {
    title: 'No tasks run',
    description:
      'This policy enforces that at least one Task is present in the PipelineRun attestation.',
    status: 'Success',
    component: 'devfile-sample-python-basic-aw05',
    collection: ['minimal'],
  },
];
