/* eslint-disable camelcase */
export const MockEnterpriseContractPolicies = {
  pipelineAnnotations: {
    'policy.pipeline.basic': [
      {
        fullPath: 'policy.pipeline.basic.deny',
        packagePath: 'policy.pipeline.basic',
        packageInfo: {
          shortName: 'basic',
          fullName: 'policy.pipeline.basic',
          title: 'Pipeline definition sanity checks',
          description:
            'Currently there is just a check to confirm the input\nappears to be a Pipeline definition. We may add additional\nsanity checks in future.',
        },
        shortName: 'unexpected_kind',
        title: 'Input data has unexpected kind',
        description: 'A sanity check to confirm the input data has the kind "Pipeline"',
        warningOrFailure: 'failure',
        failureMsg: "Unexpected kind '%s'",
        file: 'policy/pipeline/basic.rego',
        row: 27,
      },
    ],
    'policy.pipeline.required_tasks': [
      {
        fullPath: 'policy.pipeline.required_tasks.deny',
        packagePath: 'policy.pipeline.required_tasks',
        packageInfo: {
          shortName: 'required_tasks',
          fullName: 'policy.pipeline.required_tasks',
          title: 'Required tasks',
          description:
            'Stonesoup expects that certain tests are going to be run during image builds.\nThis package includes some rules to confirm that the pipeline definition\nincludes the Tekton tasks to run those required tests.',
        },
        shortName: 'required_tasks',
        title: 'Pipeline does not include all required check tasks',
        description:
          'Every build pipeline is expected to contain a set of checks and tests that\nare required by the Enterprise Contract. This rule confirms that the pipeline\ndefinition includes all the expected tasks.\n\nThe matching is done using the taskRef name rather than the pipeline task name.',
        ruleData: {
          required_task_refs: [
            'clamav-scan',
            'conftest-clair',
            'get-clair-scan',
            'sanity-inspect-image',
            'sanity-label-check',
            'sast-go',
            'sast-java-sec-check',
          ],
        },
        warningOrFailure: 'failure',
        failureMsg: "Required tasks %s were not found in the pipeline's task list",
        file: 'policy/pipeline/required_tasks.rego',
        row: 39,
      },
    ],
    'policy.pipeline.task_bundle': [
      {
        fullPath: 'policy.pipeline.task_bundle.deny',
        packagePath: 'policy.pipeline.task_bundle',
        packageInfo: {
          shortName: 'task_bundle',
          fullName: 'policy.pipeline.task_bundle',
          title: 'Task bundle',
          description:
            "To be able to reproduce and audit builds accurately it's important\nto know exactly what happens during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks in a Pipeline definition are defined in task\nbundles, and that the task bundles are from the list of known\nand trusted bundles.",
        },
        shortName: 'disallowed_task_reference',
        title: 'Task bundle was not used or is not defined',
        description:
          'Check for existence of a task bundle. Enforcing this rule will\nfail the contract if the task is not called from a bundle.',
        warningOrFailure: 'failure',
        failureMsg: "Pipeline task '%s' does not contain a bundle reference",
        file: 'policy/pipeline/task_bundle.rego',
        row: 26,
      },
      {
        fullPath: 'policy.pipeline.task_bundle.deny',
        packagePath: 'policy.pipeline.task_bundle',
        packageInfo: {
          shortName: 'task_bundle',
          fullName: 'policy.pipeline.task_bundle',
          title: 'Task bundle',
          description:
            "To be able to reproduce and audit builds accurately it's important\nto know exactly what happens during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks in a Pipeline definition are defined in task\nbundles, and that the task bundles are from the list of known\nand trusted bundles.",
        },
        shortName: 'empty_task_bundle_reference',
        title: 'Task bundle reference is empty',
        description: 'Check for a valid task bundle reference being used.',
        warningOrFailure: 'failure',
        failureMsg: "Pipeline task '%s' uses an empty bundle image reference",
        file: 'policy/pipeline/task_bundle.rego',
        row: 39,
      },
      {
        fullPath: 'policy.pipeline.task_bundle.warn',
        packagePath: 'policy.pipeline.task_bundle',
        packageInfo: {
          shortName: 'task_bundle',
          fullName: 'policy.pipeline.task_bundle',
          title: 'Task bundle',
          description:
            "To be able to reproduce and audit builds accurately it's important\nto know exactly what happens during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks in a Pipeline definition are defined in task\nbundles, and that the task bundles are from the list of known\nand trusted bundles.",
        },
        shortName: 'unpinned_task_bundle',
        title: 'Unpinned task bundle reference',
        description:
          'Check if the Tekton Bundle used for the Tasks in the Pipeline definition\nis pinned to a digest.',
        warningOrFailure: 'warning',
        failureMsg: "Pipeline task '%s' uses an unpinned task bundle reference '%s'",
        file: 'policy/pipeline/task_bundle.rego',
        row: 53,
      },
      {
        fullPath: 'policy.pipeline.task_bundle.warn',
        packagePath: 'policy.pipeline.task_bundle',
        packageInfo: {
          shortName: 'task_bundle',
          fullName: 'policy.pipeline.task_bundle',
          title: 'Task bundle',
          description:
            "To be able to reproduce and audit builds accurately it's important\nto know exactly what happens during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks in a Pipeline definition are defined in task\nbundles, and that the task bundles are from the list of known\nand trusted bundles.",
        },
        shortName: 'out_of_date_task_bundle',
        title: 'Task bundle is out of date',
        description:
          'Check if the Tekton Bundle used for the Tasks in the Pipeline definition\nis the most recent acceptable one. See the list of acceptable\ntask bundles at xref:acceptable_bundles.adoc#_task_bundles[Acceptable Bundles] or look at\nlink:https://github.com/enterprise-contract/ec-policies/blob/main/data/acceptable_tekton_bundles.yml[data/acceptable_tekton_bundles.yml]\nin this git repository.',
        warningOrFailure: 'warning',
        failureMsg: "Pipeline task '%s' uses an out of date task bundle '%s'",
        file: 'policy/pipeline/task_bundle.rego',
        row: 70,
      },
      {
        fullPath: 'policy.pipeline.task_bundle.deny',
        packagePath: 'policy.pipeline.task_bundle',
        packageInfo: {
          shortName: 'task_bundle',
          fullName: 'policy.pipeline.task_bundle',
          title: 'Task bundle',
          description:
            "To be able to reproduce and audit builds accurately it's important\nto know exactly what happens during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks in a Pipeline definition are defined in task\nbundles, and that the task bundles are from the list of known\nand trusted bundles.",
        },
        shortName: 'unacceptable_task_bundle',
        title: 'Task bundle is not acceptable',
        description:
          'Check if the Tekton Bundle used for the Tasks in the Pipeline definition\nare acceptable given the tracked effective_on date. See the list of acceptable\ntask bundles at xref:acceptable_bundles.adoc#_task_bundles[Acceptable Bundles] or look at\nlink:https://github.com/enterprise-contract/ec-policies/blob/main/data/acceptable_tekton_bundles.yml[data/acceptable_tekton_bundles.yml]\nin this git repository.',
        warningOrFailure: 'failure',
        failureMsg: "Pipeline task '%s' uses an unacceptable task bundle '%s'",
        file: 'policy/pipeline/task_bundle.rego',
        row: 87,
      },
    ],
  },
  releaseAnnotations: {
    'policy.release.attestation_type': [
      {
        fullPath: 'policy.release.attestation_type.deny',
        packagePath: 'policy.release.attestation_type',
        packageInfo: {
          shortName: 'attestation_type',
          fullName: 'policy.release.attestation_type',
          title: 'Attestation type',
          description: "Sanity checks related to the format of the image build's attestation.",
        },
        shortName: 'unknown_att_type',
        title: 'Unknown attestation type found',
        description:
          'A sanity check to confirm the attestation found for the image has a known\nattestation type.',
        ruleData: {
          known_attestation_types: ['https://in-toto.io/Statement/v0.1'],
        },
        warningOrFailure: 'failure',
        failureMsg: "Unknown attestation type '%s'",
        file: 'policy/release/attestation_type.rego',
        row: 22,
      },
    ],
    'policy.release.authorization': [
      {
        fullPath: 'policy.release.authorization.deny',
        packagePath: 'policy.release.authorization',
        packageInfo: {
          shortName: 'authorization',
          fullName: 'policy.release.authorization',
          title: 'Authorization',
          description:
            'This package contains rules to check that the image is signed-off\nfor release. There are different ways of providing that sign-off\nauthorization.\n\nTODO: Document the ways that release authorization can be provided.',
        },
        shortName: 'disallowed_no_authorization',
        title: 'Authorization does not exist',
        description: 'Enterprise Contract verifies if the build was authorized',
        warningOrFailure: 'failure',
        failureMsg: 'Commit does not contain authorization',
        file: 'policy/release/authorization.rego',
        row: 21,
      },
      {
        fullPath: 'policy.release.authorization.deny',
        packagePath: 'policy.release.authorization',
        packageInfo: {
          shortName: 'authorization',
          fullName: 'policy.release.authorization',
          title: 'Authorization',
          description:
            'This package contains rules to check that the image is signed-off\nfor release. There are different ways of providing that sign-off\nauthorization.\n\nTODO: Document the ways that release authorization can be provided.',
        },
        shortName: 'disallowed_commit_does_not_match',
        title: 'Authorized commit does not match',
        description:
          'Enterprise Contract verifies if an authorized commit was used as the source of a build',
        warningOrFailure: 'failure',
        failureMsg: 'Commit %s does not match authorized commit %s',
        file: 'policy/release/authorization.rego',
        row: 34,
      },
      {
        fullPath: 'policy.release.authorization.deny',
        packagePath: 'policy.release.authorization',
        packageInfo: {
          shortName: 'authorization',
          fullName: 'policy.release.authorization',
          title: 'Authorization',
          description:
            'This package contains rules to check that the image is signed-off\nfor release. There are different ways of providing that sign-off\nauthorization.\n\nTODO: Document the ways that release authorization can be provided.',
        },
        shortName: 'disallowed_repo_url_does_not_match',
        title: 'Authorized repo url does not match',
        description:
          'Enterprise Contract verifies if an authorized repo url was used to build an image',
        warningOrFailure: 'failure',
        failureMsg: 'Repo url %s does not match authorized repo url %s',
        file: 'policy/release/authorization.rego',
        row: 49,
      },
    ],
    'policy.release.java': [
      {
        fullPath: 'policy.release.java.deny',
        packagePath: 'policy.release.java',
        packageInfo: {
          shortName: 'java',
          fullName: 'policy.release.java',
          title: 'Java dependency checks',
          description:
            'This package contains a rule to confirm that all Java dependencies\nwere rebuilt in house rather than imported directly from potentially\nuntrusted respositories.',
        },
        shortName: 'java_foreign_dependencies',
        title: 'Prevent Java builds from depending on foreign dependencies',
        description:
          'The SBOM_JAVA_COMPONENTS_COUNT TaskResult finds dependencies that have\noriginated from foreign repositories, i.e. ones that are not rebuilt or\nredhat.',
        ruleData: {
          allowed_component_sources: ['redhat', 'rebuilt'],
        },
        warningOrFailure: 'failure',
        failureMsg: "Found Java dependencies from '%s', expecting to find only from '%s'",
        file: 'policy/release/java.rego',
        row: 27,
      },
    ],
    'policy.release.not_useful': [
      {
        fullPath: 'policy.release.not_useful.deny',
        packagePath: 'policy.release.not_useful',
        packageInfo: {
          shortName: 'not_useful',
          fullName: 'policy.release.not_useful',
          title: 'Not useful',
          description:
            'A package containing a bogus test useful for early testing and demos.\n\nTODO: Delete me',
        },
        shortName: 'bad_day',
        title: 'A dummy rule that always fails',
        description:
          "It's expected this rule will be skipped by policy configuration.\nThis rule is for demonstration and test purposes and should be deleted soon.",
        warningOrFailure: 'failure',
        failureMsg: 'It just feels like a bad day to do a release',
        effectiveOn: '2022-01-01T00:00:00Z',
        file: 'policy/release/not_useful.rego',
        row: 25,
      },
    ],
    'policy.release.step_image_registries': [
      {
        fullPath: 'policy.release.step_image_registries.deny',
        packagePath: 'policy.release.step_image_registries',
        packageInfo: {
          shortName: 'step_image_registries',
          fullName: 'policy.release.step_image_registries',
          title: 'Step image registries',
          description:
            "This package contains a rule to ensure that each task in the image's\nbuild pipeline ran using a container image from a known and presumably\ntrusted source.",
        },
        shortName: 'disallowed_task_step_image',
        title: 'Task steps ran on container images that are disallowed',
        description:
          'Enterprise Contract has a list of allowed registry prefixes. Each step in each\neach TaskRun must run on a container image with a url that matches one of the\nprefixes in the list.',
        ruleData: {
          allowed_registry_prefixes: [
            'quay.io/redhat-appstudio/',
            'registry.access.redhat.com/',
            'registry.redhat.io/',
          ],
        },
        warningOrFailure: 'failure',
        failureMsg: "Step %d in task '%s' has disallowed image ref '%s'",
        file: 'policy/release/step_image_registries.rego',
        row: 27,
      },
    ],
    'policy.release.attestation_task_bundle': [
      {
        fullPath: 'policy.release.attestation_task_bundle.deny',
        packagePath: 'policy.release.attestation_task_bundle',
        packageInfo: {
          shortName: 'attestation_task_bundle',
          fullName: 'policy.release.attestation_task_bundle',
          title: 'Task bundle checks',
          description:
            "To be able to reproduce and audit builds accurately it's important\nto know exactly what happened during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks that built the image were defined in task\nbundles, and that the task bundles used are from the list of known\nand trusted bundles.",
        },
        shortName: 'disallowed_task_reference',
        title: 'Task bundle was not used or is not defined',
        description:
          'Check for existence of a task bundle. Enforcing this rule will\nfail the contract if the task is not called from a bundle.',
        warningOrFailure: 'failure',
        failureMsg: "Pipeline task '%s' does not contain a bundle reference",
        file: 'policy/release/attestation_task_bundle.rego',
        row: 27,
      },
      {
        fullPath: 'policy.release.attestation_task_bundle.deny',
        packagePath: 'policy.release.attestation_task_bundle',
        packageInfo: {
          shortName: 'attestation_task_bundle',
          fullName: 'policy.release.attestation_task_bundle',
          title: 'Task bundle checks',
          description:
            "To be able to reproduce and audit builds accurately it's important\nto know exactly what happened during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks that built the image were defined in task\nbundles, and that the task bundles used are from the list of known\nand trusted bundles.",
        },
        shortName: 'empty_task_bundle_reference',
        title: 'Task bundle reference is empty',
        description: 'Check for a valid task bundle reference being used.',
        warningOrFailure: 'failure',
        failureMsg: "Pipeline task '%s' uses an empty bundle image reference",
        file: 'policy/release/attestation_task_bundle.rego',
        row: 40,
      },
      {
        fullPath: 'policy.release.attestation_task_bundle.warn',
        packagePath: 'policy.release.attestation_task_bundle',
        packageInfo: {
          shortName: 'attestation_task_bundle',
          fullName: 'policy.release.attestation_task_bundle',
          title: 'Task bundle checks',
          description:
            "To be able to reproduce and audit builds accurately it's important\nto know exactly what happened during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks that built the image were defined in task\nbundles, and that the task bundles used are from the list of known\nand trusted bundles.",
        },
        shortName: 'unpinned_task_bundle',
        title: 'Unpinned task bundle reference',
        description:
          'Check if the Tekton Bundle used for the Tasks in the Pipeline definition\nis pinned to a digest.',
        warningOrFailure: 'warning',
        failureMsg: "Pipeline task '%s' uses an unpinned task bundle reference '%s'",
        file: 'policy/release/attestation_task_bundle.rego',
        row: 54,
      },
      {
        fullPath: 'policy.release.attestation_task_bundle.warn',
        packagePath: 'policy.release.attestation_task_bundle',
        packageInfo: {
          shortName: 'attestation_task_bundle',
          fullName: 'policy.release.attestation_task_bundle',
          title: 'Task bundle checks',
          description:
            "To be able to reproduce and audit builds accurately it's important\nto know exactly what happened during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks that built the image were defined in task\nbundles, and that the task bundles used are from the list of known\nand trusted bundles.",
        },
        shortName: 'out_of_date_task_bundle',
        title: 'Task bundle is out of date',
        description:
          'Check if the Tekton Bundle used for the Tasks in the attestation\nis the most recent acceptable one. See the list of acceptable\ntask bundles at xref:acceptable_bundles.adoc#_task_bundles[Acceptable Bundles] or look at\nlink:https://github.com/enterprise-contract/ec-policies/blob/main/data/acceptable_tekton_bundles.yml[data/acceptable_tekton_bundles.yml]\nin this git repository.',
        warningOrFailure: 'warning',
        failureMsg: "Pipeline task '%s' uses an out of date task bundle '%s'",
        file: 'policy/release/attestation_task_bundle.rego',
        row: 71,
      },
      {
        fullPath: 'policy.release.attestation_task_bundle.deny',
        packagePath: 'policy.release.attestation_task_bundle',
        packageInfo: {
          shortName: 'attestation_task_bundle',
          fullName: 'policy.release.attestation_task_bundle',
          title: 'Task bundle checks',
          description:
            "To be able to reproduce and audit builds accurately it's important\nto know exactly what happened during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks that built the image were defined in task\nbundles, and that the task bundles used are from the list of known\nand trusted bundles.",
        },
        shortName: 'unacceptable_task_bundle',
        title: 'Task bundle is not acceptable',
        description:
          'Check if the Tekton Bundle used for the Tasks in the attestation\nare acceptable given the tracked effective_on date. See the list of acceptable\ntask bundles at xref:acceptable_bundles.adoc#_task_bundles[Acceptable Bundles] or look at\nlink:https://github.com/enterprise-contract/ec-policies/blob/main/data/acceptable_tekton_bundles.yml[data/acceptable_tekton_bundles.yml]\nin this git repository.',
        warningOrFailure: 'failure',
        failureMsg: "Pipeline task '%s' uses an unacceptable task bundle '%s'",
        file: 'policy/release/attestation_task_bundle.rego',
        row: 88,
      },
    ],
    'policy.release.tasks': [
      {
        fullPath: 'policy.release.tasks.deny',
        packagePath: 'policy.release.tasks',
        packageInfo: {
          shortName: 'tasks',
          fullName: 'policy.release.tasks',
          title: 'Tasks',
          description:
            'Enterprise Contract expects that a set of tasks were included\nin the pipeline build for each image to be released.\nThis package includes a set of rules to verify that the expected\ntasks ran in the pipeline when the image was built.',
        },
        shortName: 'tasks_missing',
        title: 'No tasks run',
        description:
          'This policy enforces that at least one Task is present in the PipelineRun\nattestation.',
        warningOrFailure: 'failure',
        failureMsg: 'No tasks found in PipelineRun attestation',
        file: 'policy/release/tasks.rego',
        row: 41,
      },
      {
        fullPath: 'policy.release.tasks.deny',
        packagePath: 'policy.release.tasks',
        packageInfo: {
          shortName: 'tasks',
          fullName: 'policy.release.tasks',
          title: 'Tasks',
          description:
            'Enterprise Contract expects that a set of tasks were included\nin the pipeline build for each image to be released.\nThis package includes a set of rules to verify that the expected\ntasks ran in the pipeline when the image was built.',
        },
        shortName: 'tasks_required',
        title: 'Required tasks not run',
        description:
          'This policy enforces that the required set of tasks is run in a\nPipelineRun.',
        ruleData: {
          required_task_refs: [
            'add-sbom-and-push',
            'clamav-scan',
            'deprecated-image-check',
            'get-clair-scan',
            'sanity-inspect-image',
            'sanity-label-check',
            'sanity-optional-label-check',
            'sast-go',
          ],
        },
        warningOrFailure: 'failure',
        failureMsg: "Required task(s) '%s' not found in the PipelineRun attestation",
        file: 'policy/release/tasks.rego',
        row: 57,
      },
    ],
    'policy.release.test': [
      {
        fullPath: 'policy.release.test.deny',
        packagePath: 'policy.release.test',
        packageInfo: {
          shortName: 'test',
          fullName: 'policy.release.test',
          title: 'Test',
          description:
            'Enterprise Contract requires that each build was subjected\nto a set of tests and that those tests all passed. This package\nincludes a set of rules to verify that.\n\nTODO: Document how you can skip the requirement for individual\ntests if needed using the `non_blocking_rule` configuration.',
        },
        shortName: 'test_data_missing',
        title: 'No test data found',
        description:
          'None of the tasks in the pipeline included a HACBS_TEST_OUTPUT\ntask result, which is where Enterprise Contract expects to find\ntest result data.',
        warningOrFailure: 'failure',
        failureMsg: 'No test data found',
        file: 'policy/release/test.rego',
        row: 26,
      },
      {
        fullPath: 'policy.release.test.deny',
        packagePath: 'policy.release.test',
        packageInfo: {
          shortName: 'test',
          fullName: 'policy.release.test',
          title: 'Test',
          description:
            'Enterprise Contract requires that each build was subjected\nto a set of tests and that those tests all passed. This package\nincludes a set of rules to verify that.\n\nTODO: Document how you can skip the requirement for individual\ntests if needed using the `non_blocking_rule` configuration.',
        },
        shortName: 'test_results_missing',
        title: 'Test data is missing the results key',
        description:
          "Each test result is expected to have a 'results' key. In at least\none of the HACBS_TEST_OUTPUT task results this key was not present.",
        warningOrFailure: 'failure',
        failureMsg: 'Found tests without results',
        file: 'policy/release/test.rego',
        row: 40,
      },
      {
        fullPath: 'policy.release.test.deny',
        packagePath: 'policy.release.test',
        packageInfo: {
          shortName: 'test',
          fullName: 'policy.release.test',
          title: 'Test',
          description:
            'Enterprise Contract requires that each build was subjected\nto a set of tests and that those tests all passed. This package\nincludes a set of rules to verify that.\n\nTODO: Document how you can skip the requirement for individual\ntests if needed using the `non_blocking_rule` configuration.',
        },
        shortName: 'test_result_unsupported',
        title: 'Unsupported result in test data',
        description:
          'This policy expects a set of known/supported results in the test data\nIt is a failure if we encounter a result that is not supported.',
        ruleData: {
          supported_results: ['SUCCESS', 'FAILURE', 'ERROR', 'SKIPPED'],
        },
        warningOrFailure: 'failure',
        failureMsg: "Test '%s' has unsupported result '%s'",
        file: 'policy/release/test.rego',
        row: 61,
      },
      {
        fullPath: 'policy.release.test.deny',
        packagePath: 'policy.release.test',
        packageInfo: {
          shortName: 'test',
          fullName: 'policy.release.test',
          title: 'Test',
          description:
            'Enterprise Contract requires that each build was subjected\nto a set of tests and that those tests all passed. This package\nincludes a set of rules to verify that.\n\nTODO: Document how you can skip the requirement for individual\ntests if needed using the `non_blocking_rule` configuration.',
        },
        shortName: 'test_result_failures',
        title: 'Test result is FAILURE or ERROR',
        description:
          'Enterprise Contract requires that all the tests in the test results\nhave a successful result. A successful result is one that isn\'t a\n"FAILURE" or "ERROR". This will fail if any of the tests failed and\nthe failure message will list the names of the failing tests.',
        warningOrFailure: 'failure',
        failureMsg: 'The following tests did not complete successfully: %s',
        file: 'policy/release/test.rego',
        row: 84,
      },
      {
        fullPath: 'policy.release.test.warn',
        packagePath: 'policy.release.test',
        packageInfo: {
          shortName: 'test',
          fullName: 'policy.release.test',
          title: 'Test',
          description:
            'Enterprise Contract requires that each build was subjected\nto a set of tests and that those tests all passed. This package\nincludes a set of rules to verify that.\n\nTODO: Document how you can skip the requirement for individual\ntests if needed using the `non_blocking_rule` configuration.',
        },
        shortName: 'test_result_skipped',
        title: 'Some tests were skipped',
        description: 'Collects all tests that have their result set to "SKIPPED".',
        warningOrFailure: 'warning',
        failureMsg: 'The following tests were skipped: %s',
        file: 'policy/release/test.rego',
        row: 113,
      },
    ],
  },
  acceptableBundles: {
    'quay.io/redhat-appstudio/appstudio-tasks': [
      {
        digest: 'sha256:5397d5764edc8257f382d7da8c1823dade3c6db6abca4439d42202e83f1dddd3',
        effective_on: '2022-10-07T00:00:00Z',
        tag: '4ddf71fe1c22d6fc6d33f467337dfdfa055b9927-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:5397d5764edc8257f382d7da8c1823dade3c6db6abca4439d42202e83f1dddd3',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=4ddf71fe1c22d6fc6d33f467337dfdfa055b9927-3',
        shortDigest: '5397d5764edc',
      },
      {
        digest: 'sha256:ebb6e21088ecc2d107a2632b3aab3c7ce693476d7af0b648e76b816bb9f4f2f5',
        effective_on: '2022-10-07T00:00:00Z',
        tag: '4ddf71fe1c22d6fc6d33f467337dfdfa055b9927-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:ebb6e21088ecc2d107a2632b3aab3c7ce693476d7af0b648e76b816bb9f4f2f5',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=4ddf71fe1c22d6fc6d33f467337dfdfa055b9927-2',
        shortDigest: 'ebb6e21088ec',
      },
      {
        digest: 'sha256:0a23e888e8e1fdc3f2bfb3901020582da93619e14a60f18eb5458f29753ee56b',
        effective_on: '2022-10-07T00:00:00Z',
        tag: '4ddf71fe1c22d6fc6d33f467337dfdfa055b9927-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:0a23e888e8e1fdc3f2bfb3901020582da93619e14a60f18eb5458f29753ee56b',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=4ddf71fe1c22d6fc6d33f467337dfdfa055b9927-1',
        shortDigest: '0a23e888e8e1',
      },
      {
        digest: 'sha256:806797b5629db1b952b67955d688912d6ffec6416df37bfdfc102b7a41d036be',
        effective_on: '2022-10-07T00:00:00Z',
        tag: 'a28b1e8ead38b6bd6932636ae535e245d66e167b-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:806797b5629db1b952b67955d688912d6ffec6416df37bfdfc102b7a41d036be',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=a28b1e8ead38b6bd6932636ae535e245d66e167b-3',
        shortDigest: '806797b5629d',
      },
      {
        digest: 'sha256:29f03aed37ed3ab4891fd14b88d9abaf9cf17129ed74d91fa3361cb17b6c5459',
        effective_on: '2022-10-07T00:00:00Z',
        tag: 'a28b1e8ead38b6bd6932636ae535e245d66e167b-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:29f03aed37ed3ab4891fd14b88d9abaf9cf17129ed74d91fa3361cb17b6c5459',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=a28b1e8ead38b6bd6932636ae535e245d66e167b-2',
        shortDigest: '29f03aed37ed',
      },
      {
        digest: 'sha256:4914043ddcd464da099953f9dd242d06f07f7184a55c16f65540b4dd89cb24c9',
        effective_on: '2022-10-07T00:00:00Z',
        tag: 'a28b1e8ead38b6bd6932636ae535e245d66e167b-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:4914043ddcd464da099953f9dd242d06f07f7184a55c16f65540b4dd89cb24c9',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=a28b1e8ead38b6bd6932636ae535e245d66e167b-1',
        shortDigest: '4914043ddcd4',
      },
      {
        digest: 'sha256:a728a012918c7483ce0108296cb11d9a8de7d98b9521901325fd09b062af259d',
        effective_on: '2022-10-03T00:00:00Z',
        tag: '35ff4b48be4fc6bdac97dc8ccae82487aef4bd30-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:a728a012918c7483ce0108296cb11d9a8de7d98b9521901325fd09b062af259d',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=35ff4b48be4fc6bdac97dc8ccae82487aef4bd30-3',
        shortDigest: 'a728a012918c',
      },
      {
        digest: 'sha256:0edc7531bba6456c64fbb548b6a0bc91d473fb069937f009b47f98d4330f3bc1',
        effective_on: '2022-10-03T00:00:00Z',
        tag: '35ff4b48be4fc6bdac97dc8ccae82487aef4bd30-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:0edc7531bba6456c64fbb548b6a0bc91d473fb069937f009b47f98d4330f3bc1',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=35ff4b48be4fc6bdac97dc8ccae82487aef4bd30-2',
        shortDigest: '0edc7531bba6',
      },
      {
        digest: 'sha256:3a54022d00757bfd362ebbc5b2447914eee5457707399fe1150bf739d1a36abf',
        effective_on: '2022-10-03T00:00:00Z',
        tag: '35ff4b48be4fc6bdac97dc8ccae82487aef4bd30-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:3a54022d00757bfd362ebbc5b2447914eee5457707399fe1150bf739d1a36abf',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=35ff4b48be4fc6bdac97dc8ccae82487aef4bd30-1',
        shortDigest: '3a54022d0075',
      },
      {
        digest: 'sha256:17af3235c7e61d1700c07bb63d95775166a40e1d8ccbd20bbd2a90e5453a574a',
        effective_on: '2022-10-02T00:00:00Z',
        tag: '13f5d9c921b3f727684a00084037f673a0dc4273-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:17af3235c7e61d1700c07bb63d95775166a40e1d8ccbd20bbd2a90e5453a574a',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=13f5d9c921b3f727684a00084037f673a0dc4273-3',
        shortDigest: '17af3235c7e6',
      },
      {
        digest: 'sha256:8f82b8d82a58ad43f93d508453e18df64dddb04c2e4bb9cc73519b415c0c7fc6',
        effective_on: '2022-10-02T00:00:00Z',
        tag: '13f5d9c921b3f727684a00084037f673a0dc4273-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:8f82b8d82a58ad43f93d508453e18df64dddb04c2e4bb9cc73519b415c0c7fc6',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=13f5d9c921b3f727684a00084037f673a0dc4273-2',
        shortDigest: '8f82b8d82a58',
      },
      {
        digest: 'sha256:ee206f1539dbf37f8c8fba1410bc76e14b0be80ba23a2111998e22f7aed727e5',
        effective_on: '2022-10-02T00:00:00Z',
        tag: '13f5d9c921b3f727684a00084037f673a0dc4273-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:ee206f1539dbf37f8c8fba1410bc76e14b0be80ba23a2111998e22f7aed727e5',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=13f5d9c921b3f727684a00084037f673a0dc4273-1',
        shortDigest: 'ee206f1539db',
      },
      {
        digest: 'sha256:6a59ac0283288a527eccfaaa135ec69582e4e088065a956d4a9c5390717752d7',
        effective_on: '2022-10-01T00:00:00Z',
        tag: '1396b364b4061a775ae00df53c90495e00c7bd7e-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:6a59ac0283288a527eccfaaa135ec69582e4e088065a956d4a9c5390717752d7',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=1396b364b4061a775ae00df53c90495e00c7bd7e-3',
        shortDigest: '6a59ac028328',
      },
      {
        digest: 'sha256:fcbec1cac1da09d88db533f2309f2ef78b99c57f3f89ca89b3f5b3b9d43a97c4',
        effective_on: '2022-10-01T00:00:00Z',
        tag: '1396b364b4061a775ae00df53c90495e00c7bd7e-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:fcbec1cac1da09d88db533f2309f2ef78b99c57f3f89ca89b3f5b3b9d43a97c4',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=1396b364b4061a775ae00df53c90495e00c7bd7e-2',
        shortDigest: 'fcbec1cac1da',
      },
      {
        digest: 'sha256:9043d4608743a147581ef353cee47991bd0636d29de71938978ac9606073ac57',
        effective_on: '2022-10-01T00:00:00Z',
        tag: '1396b364b4061a775ae00df53c90495e00c7bd7e-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:9043d4608743a147581ef353cee47991bd0636d29de71938978ac9606073ac57',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=1396b364b4061a775ae00df53c90495e00c7bd7e-1',
        shortDigest: '9043d4608743',
      },
      {
        digest: 'sha256:73c4b3699e2baba369efda0b66c22905203b0e7e437d02888527d06a6e0fdb52',
        effective_on: '2022-09-23T00:00:00Z',
        tag: '510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:73c4b3699e2baba369efda0b66c22905203b0e7e437d02888527d06a6e0fdb52',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-3',
        shortDigest: '73c4b3699e2b',
      },
      {
        digest: 'sha256:900639d8cc448975d6027841322fa41ecc27f9112923ee29cd2a81a25467a6d3',
        effective_on: '2022-09-23T00:00:00Z',
        tag: '510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:900639d8cc448975d6027841322fa41ecc27f9112923ee29cd2a81a25467a6d3',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-2',
        shortDigest: '900639d8cc44',
      },
      {
        digest: 'sha256:34e04f0edfcaf22f9b8d2b7f17e235e0440d69b25fe08fc293028587e5072009',
        effective_on: '2022-09-23T00:00:00Z',
        tag: '510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:34e04f0edfcaf22f9b8d2b7f17e235e0440d69b25fe08fc293028587e5072009',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=510fa6e99f1fa1f816c96354bbaf1ad155c6d9c3-1',
        shortDigest: '34e04f0edfca',
      },
      {
        digest: 'sha256:542e8dd7a4652f7db0c4ce7301176e6992944dde5ec36b11e82aa5a003a30b88',
        effective_on: '2022-09-21T00:00:00Z',
        tag: '14f2d6ea7b0d087d79ae9816e0a41c331a3a0323-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:542e8dd7a4652f7db0c4ce7301176e6992944dde5ec36b11e82aa5a003a30b88',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=14f2d6ea7b0d087d79ae9816e0a41c331a3a0323-3',
        shortDigest: '542e8dd7a465',
      },
      {
        digest: 'sha256:894b8ced07a7bbf2be282b383e3f9bff5acfedab697636ccb20d5f287a34aad4',
        effective_on: '2022-09-21T00:00:00Z',
        tag: '14f2d6ea7b0d087d79ae9816e0a41c331a3a0323-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:894b8ced07a7bbf2be282b383e3f9bff5acfedab697636ccb20d5f287a34aad4',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=14f2d6ea7b0d087d79ae9816e0a41c331a3a0323-2',
        shortDigest: '894b8ced07a7',
      },
      {
        digest: 'sha256:ff48355552f1f3ce0ffaacd8cab0df8dd11152ae0edbea82816e540e7a4def4f',
        effective_on: '2022-09-21T00:00:00Z',
        tag: '14f2d6ea7b0d087d79ae9816e0a41c331a3a0323-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:ff48355552f1f3ce0ffaacd8cab0df8dd11152ae0edbea82816e540e7a4def4f',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=14f2d6ea7b0d087d79ae9816e0a41c331a3a0323-1',
        shortDigest: 'ff48355552f1',
      },
      {
        digest: 'sha256:f2acd3d89cebe2f6fdd48aa8a61f286f606a608bf550a05e8ed0582971a0004b',
        effective_on: '2022-09-17T00:00:00Z',
        tag: '0509480fd9277a9614e7489be630adf8cf53710c-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:f2acd3d89cebe2f6fdd48aa8a61f286f606a608bf550a05e8ed0582971a0004b',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=0509480fd9277a9614e7489be630adf8cf53710c-3',
        shortDigest: 'f2acd3d89ceb',
      },
      {
        digest: 'sha256:a88301853a65849a133410f0931b95d6cf7c10899362449e24958c36016e4dfe',
        effective_on: '2022-09-17T00:00:00Z',
        tag: '0509480fd9277a9614e7489be630adf8cf53710c-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:a88301853a65849a133410f0931b95d6cf7c10899362449e24958c36016e4dfe',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=0509480fd9277a9614e7489be630adf8cf53710c-2',
        shortDigest: 'a88301853a65',
      },
      {
        digest: 'sha256:8d968f9fb1ef05a01bd322cd02dcb1946136166e8c905641b4e791471d58922f',
        effective_on: '2022-09-17T00:00:00Z',
        tag: '0509480fd9277a9614e7489be630adf8cf53710c-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:8d968f9fb1ef05a01bd322cd02dcb1946136166e8c905641b4e791471d58922f',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=0509480fd9277a9614e7489be630adf8cf53710c-1',
        shortDigest: '8d968f9fb1ef',
      },
      {
        digest: 'sha256:353f64196302f6d074c8c7a269bf7590e8cac0deebd08b6e22ed338373493878',
        effective_on: '2022-09-16T00:00:00Z',
        tag: 'd9f4a1603326276444fc4e6d1994f6d066673391-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:353f64196302f6d074c8c7a269bf7590e8cac0deebd08b6e22ed338373493878',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=d9f4a1603326276444fc4e6d1994f6d066673391-3',
        shortDigest: '353f64196302',
      },
      {
        digest: 'sha256:48fa5b76f2c78880f17e2a8292cae26c081f7ed50d3d7fbe5817764ac14ec435',
        effective_on: '2022-09-16T00:00:00Z',
        tag: 'd9f4a1603326276444fc4e6d1994f6d066673391-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:48fa5b76f2c78880f17e2a8292cae26c081f7ed50d3d7fbe5817764ac14ec435',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=d9f4a1603326276444fc4e6d1994f6d066673391-2',
        shortDigest: '48fa5b76f2c7',
      },
      {
        digest: 'sha256:b8fd4937e03abbdbedf9ca539565bd60d06f02a37828d530a5ae8e8f97bcd418',
        effective_on: '2022-09-16T00:00:00Z',
        tag: 'd9f4a1603326276444fc4e6d1994f6d066673391-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:b8fd4937e03abbdbedf9ca539565bd60d06f02a37828d530a5ae8e8f97bcd418',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=d9f4a1603326276444fc4e6d1994f6d066673391-1',
        shortDigest: 'b8fd4937e03a',
      },
      {
        digest: 'sha256:e7d8f3ce4a3e88e41a57acf5c3b92e97ff335ee539ea3388b15d21d1998203e2',
        effective_on: '2022-09-15T00:00:00Z',
        tag: 'ef23dc285df519806e4e760b4356fd6779323a47-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:e7d8f3ce4a3e88e41a57acf5c3b92e97ff335ee539ea3388b15d21d1998203e2',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=ef23dc285df519806e4e760b4356fd6779323a47-3',
        shortDigest: 'e7d8f3ce4a3e',
      },
      {
        digest: 'sha256:f63c7aa8aa0a3aac1d5224aa3b4d0e60d52e9d09639d5ce919b980f5010b555d',
        effective_on: '2022-09-15T00:00:00Z',
        tag: 'ef23dc285df519806e4e760b4356fd6779323a47-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:f63c7aa8aa0a3aac1d5224aa3b4d0e60d52e9d09639d5ce919b980f5010b555d',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=ef23dc285df519806e4e760b4356fd6779323a47-2',
        shortDigest: 'f63c7aa8aa0a',
      },
      {
        digest: 'sha256:b11d7fd7fc2d009436123cb864d6ace65761c666bc4d8715daee38abf9a2e5bb',
        effective_on: '2022-09-15T00:00:00Z',
        tag: 'ef23dc285df519806e4e760b4356fd6779323a47-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:b11d7fd7fc2d009436123cb864d6ace65761c666bc4d8715daee38abf9a2e5bb',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=ef23dc285df519806e4e760b4356fd6779323a47-1',
        shortDigest: 'b11d7fd7fc2d',
      },
      {
        digest: 'sha256:fd7ce153b019c399375e5a7220b3adcc27bd5579e4c8fd878f192d5de627ea11',
        effective_on: '2022-09-14T00:00:00Z',
        tag: '3dddea8074c9fa13e7146e3c5c7d75e4bd8f7bb0-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:fd7ce153b019c399375e5a7220b3adcc27bd5579e4c8fd878f192d5de627ea11',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=3dddea8074c9fa13e7146e3c5c7d75e4bd8f7bb0-3',
        shortDigest: 'fd7ce153b019',
      },
      {
        digest: 'sha256:b1f3fce460f07824dd0d3a79fd3ba3f48173c8e74d730001ac08805384ec2105',
        effective_on: '2022-09-14T00:00:00Z',
        tag: '3dddea8074c9fa13e7146e3c5c7d75e4bd8f7bb0-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:b1f3fce460f07824dd0d3a79fd3ba3f48173c8e74d730001ac08805384ec2105',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=3dddea8074c9fa13e7146e3c5c7d75e4bd8f7bb0-2',
        shortDigest: 'b1f3fce460f0',
      },
      {
        digest: 'sha256:f9160485eb8c9a6b94a1ac6d12d24a66f4482d36edd3e825db6686d3843c0420',
        effective_on: '2022-09-14T00:00:00Z',
        tag: '3dddea8074c9fa13e7146e3c5c7d75e4bd8f7bb0-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:f9160485eb8c9a6b94a1ac6d12d24a66f4482d36edd3e825db6686d3843c0420',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=3dddea8074c9fa13e7146e3c5c7d75e4bd8f7bb0-1',
        shortDigest: 'f9160485eb8c',
      },
      {
        digest: 'sha256:6d5880d70a34f21fefe65b04f153e9127c96cb98a0f1d8e63bd96a5005552152',
        effective_on: '2022-09-11T00:00:00Z',
        tag: 'c1140e87d335dbe24f636bfb4a280c0dbbba5c48-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:6d5880d70a34f21fefe65b04f153e9127c96cb98a0f1d8e63bd96a5005552152',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=c1140e87d335dbe24f636bfb4a280c0dbbba5c48-3',
        shortDigest: '6d5880d70a34',
      },
      {
        digest: 'sha256:38c82d1e855d972ce097805d03930277b42ed0a567736589583ccedb738c892d',
        effective_on: '2022-09-11T00:00:00Z',
        tag: 'c1140e87d335dbe24f636bfb4a280c0dbbba5c48-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:38c82d1e855d972ce097805d03930277b42ed0a567736589583ccedb738c892d',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=c1140e87d335dbe24f636bfb4a280c0dbbba5c48-2',
        shortDigest: '38c82d1e855d',
      },
      {
        digest: 'sha256:a28622dcb810bcb07c1e3a135a5f445d96e15e0cb1dfe6cc6936b6d071f55ca2',
        effective_on: '2022-09-11T00:00:00Z',
        tag: 'c1140e87d335dbe24f636bfb4a280c0dbbba5c48-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:a28622dcb810bcb07c1e3a135a5f445d96e15e0cb1dfe6cc6936b6d071f55ca2',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=c1140e87d335dbe24f636bfb4a280c0dbbba5c48-1',
        shortDigest: 'a28622dcb810',
      },
      {
        digest: 'sha256:c58feddf93b4bbb51a24b8bd3dd7e3cc4fd5df65a6497825f38fba276715c3c6',
        effective_on: '2022-09-10T00:00:00Z',
        tag: '876e41aeb1c9c493548c7a6c6c082861aac89d71-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:c58feddf93b4bbb51a24b8bd3dd7e3cc4fd5df65a6497825f38fba276715c3c6',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=876e41aeb1c9c493548c7a6c6c082861aac89d71-3',
        shortDigest: 'c58feddf93b4',
      },
      {
        digest: 'sha256:99176e24ea6469c31e944f9027acff8f5c718277c4cc4716fd49c7422c1759f8',
        effective_on: '2022-09-10T00:00:00Z',
        tag: '876e41aeb1c9c493548c7a6c6c082861aac89d71-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:99176e24ea6469c31e944f9027acff8f5c718277c4cc4716fd49c7422c1759f8',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=876e41aeb1c9c493548c7a6c6c082861aac89d71-2',
        shortDigest: '99176e24ea64',
      },
      {
        digest: 'sha256:1a8b0ebb3af1b1c662af62ec86c80ed64078f3126f29fdbd34b05e44550b1d6b',
        effective_on: '2022-09-10T00:00:00Z',
        tag: '876e41aeb1c9c493548c7a6c6c082861aac89d71-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:1a8b0ebb3af1b1c662af62ec86c80ed64078f3126f29fdbd34b05e44550b1d6b',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=876e41aeb1c9c493548c7a6c6c082861aac89d71-1',
        shortDigest: '1a8b0ebb3af1',
      },
      {
        digest: 'sha256:e6dec81da724ba6827ee1a1a1b7488328d22433dd54fb9c9c7070c045d291111',
        effective_on: '2022-09-09T00:00:00Z',
        tag: 'a27b5921acfe57ebd51bce96e7fa34ebd3518809-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:e6dec81da724ba6827ee1a1a1b7488328d22433dd54fb9c9c7070c045d291111',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=a27b5921acfe57ebd51bce96e7fa34ebd3518809-3',
        shortDigest: 'e6dec81da724',
      },
      {
        digest: 'sha256:578957a68c7238889dd37904706d2e29d9e23d5fa5093191becb6662fa272e17',
        effective_on: '2022-09-09T00:00:00Z',
        tag: 'a27b5921acfe57ebd51bce96e7fa34ebd3518809-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:578957a68c7238889dd37904706d2e29d9e23d5fa5093191becb6662fa272e17',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=a27b5921acfe57ebd51bce96e7fa34ebd3518809-2',
        shortDigest: '578957a68c72',
      },
      {
        digest: 'sha256:2e97ca5a8ba698151b2f406abd898865fff7e5db8cbdeda8bfe83a2c0bc0a957',
        effective_on: '2022-09-09T00:00:00Z',
        tag: 'a27b5921acfe57ebd51bce96e7fa34ebd3518809-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:2e97ca5a8ba698151b2f406abd898865fff7e5db8cbdeda8bfe83a2c0bc0a957',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=a27b5921acfe57ebd51bce96e7fa34ebd3518809-1',
        shortDigest: '2e97ca5a8ba6',
      },
      {
        digest: 'sha256:232dad26ae42f3bbb5f69a51493dd20d87ecf4f76ef8fcba3fe540f5f8cfb4bd',
        effective_on: '2022-09-04T00:00:00Z',
        tag: '50f736328e1e426af7c7751cae2326be7857685b-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:232dad26ae42f3bbb5f69a51493dd20d87ecf4f76ef8fcba3fe540f5f8cfb4bd',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=50f736328e1e426af7c7751cae2326be7857685b-3',
        shortDigest: '232dad26ae42',
      },
      {
        digest: 'sha256:7faefd1804679d51323030ada00e59883b75711261e8a0fb2b0cf82b2d1c8f90',
        effective_on: '2022-09-04T00:00:00Z',
        tag: '50f736328e1e426af7c7751cae2326be7857685b-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:7faefd1804679d51323030ada00e59883b75711261e8a0fb2b0cf82b2d1c8f90',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=50f736328e1e426af7c7751cae2326be7857685b-2',
        shortDigest: '7faefd180467',
      },
      {
        digest: 'sha256:fc397569b9264cb2044dd0f33eea79fad5f93de3f0f64ae329874948c67743f9',
        effective_on: '2022-09-04T00:00:00Z',
        tag: '50f736328e1e426af7c7751cae2326be7857685b-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:fc397569b9264cb2044dd0f33eea79fad5f93de3f0f64ae329874948c67743f9',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=50f736328e1e426af7c7751cae2326be7857685b-1',
        shortDigest: 'fc397569b926',
      },
      {
        digest: 'sha256:f88103ae4bfec1115fb62bbc0a62d0db0bfd96caff342c9105b7e2514e0c500e',
        effective_on: '2022-09-03T00:00:00Z',
        tag: '982ed370e257a888d3ae5dbc3ce26a347ef85d39-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:f88103ae4bfec1115fb62bbc0a62d0db0bfd96caff342c9105b7e2514e0c500e',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=982ed370e257a888d3ae5dbc3ce26a347ef85d39-3',
        shortDigest: 'f88103ae4bfe',
      },
      {
        digest: 'sha256:1c6a1118c52b40c6e870ba22d221e4c56588e376d04cc1debbd5bbed4fe20989',
        effective_on: '2022-09-03T00:00:00Z',
        tag: '982ed370e257a888d3ae5dbc3ce26a347ef85d39-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:1c6a1118c52b40c6e870ba22d221e4c56588e376d04cc1debbd5bbed4fe20989',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=982ed370e257a888d3ae5dbc3ce26a347ef85d39-2',
        shortDigest: '1c6a1118c52b',
      },
      {
        digest: 'sha256:2e154f5614acc9d4305434a9f3a590e0a29a793c804ee6d53abc72d9b3ecd9c4',
        effective_on: '2022-09-03T00:00:00Z',
        tag: '982ed370e257a888d3ae5dbc3ce26a347ef85d39-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:2e154f5614acc9d4305434a9f3a590e0a29a793c804ee6d53abc72d9b3ecd9c4',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=982ed370e257a888d3ae5dbc3ce26a347ef85d39-1',
        shortDigest: '2e154f5614ac',
      },
      {
        digest: 'sha256:f62b56df1807b017768d4a4595688d796fff0c86383f23cf42cbc8d71121b990',
        effective_on: '2022-09-02T00:00:00Z',
        tag: '8e1bdea59a9cbf2a3d8199af74ed4cc1939eebf2-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:f62b56df1807b017768d4a4595688d796fff0c86383f23cf42cbc8d71121b990',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=8e1bdea59a9cbf2a3d8199af74ed4cc1939eebf2-3',
        shortDigest: 'f62b56df1807',
      },
      {
        digest: 'sha256:2612d88f4a807ba97313b018d736df5eb05fe91301ef726c9668a9698268a515',
        effective_on: '2022-09-02T00:00:00Z',
        tag: '8e1bdea59a9cbf2a3d8199af74ed4cc1939eebf2-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:2612d88f4a807ba97313b018d736df5eb05fe91301ef726c9668a9698268a515',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=8e1bdea59a9cbf2a3d8199af74ed4cc1939eebf2-2',
        shortDigest: '2612d88f4a80',
      },
      {
        digest: 'sha256:7ee753b4372f90701943da42f3ed696afcd7d085047583619ec2245de29ccfb1',
        effective_on: '2022-09-02T00:00:00Z',
        tag: '8e1bdea59a9cbf2a3d8199af74ed4cc1939eebf2-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:7ee753b4372f90701943da42f3ed696afcd7d085047583619ec2245de29ccfb1',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=8e1bdea59a9cbf2a3d8199af74ed4cc1939eebf2-1',
        shortDigest: '7ee753b4372f',
      },
      {
        digest: 'sha256:fb33ced4f72cb077da274d77269a36b319b8b6a928a35b92917c72c6be9e37e8',
        effective_on: '2022-09-01T00:00:00Z',
        tag: 'e86ff8c111cd50b620590761a353cc97586bd1b3-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:fb33ced4f72cb077da274d77269a36b319b8b6a928a35b92917c72c6be9e37e8',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=e86ff8c111cd50b620590761a353cc97586bd1b3-3',
        shortDigest: 'fb33ced4f72c',
      },
      {
        digest: 'sha256:4b2c4687acbd2ec6580f6df10fac1c156505b18f3304817ce82861ac6a3ae771',
        effective_on: '2022-09-01T00:00:00Z',
        tag: 'e86ff8c111cd50b620590761a353cc97586bd1b3-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:4b2c4687acbd2ec6580f6df10fac1c156505b18f3304817ce82861ac6a3ae771',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=e86ff8c111cd50b620590761a353cc97586bd1b3-2',
        shortDigest: '4b2c4687acbd',
      },
      {
        digest: 'sha256:95b93a8d3faec774712d64e7a81798fd058a92ac68b925698cd156e126b9d4a0',
        effective_on: '2022-09-01T00:00:00Z',
        tag: 'e86ff8c111cd50b620590761a353cc97586bd1b3-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:95b93a8d3faec774712d64e7a81798fd058a92ac68b925698cd156e126b9d4a0',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=e86ff8c111cd50b620590761a353cc97586bd1b3-1',
        shortDigest: '95b93a8d3fae',
      },
      {
        digest: 'sha256:0a6255e34701ace6520079ef55f541054da7ab6f44f6aa9e315c78bd2ee4d9ff',
        effective_on: '2022-08-31T00:00:00Z',
        tag: 'f54fb70bcdd88e4767375249d31bf2532cd5aaed-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:0a6255e34701ace6520079ef55f541054da7ab6f44f6aa9e315c78bd2ee4d9ff',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=f54fb70bcdd88e4767375249d31bf2532cd5aaed-3',
        shortDigest: '0a6255e34701',
      },
      {
        digest: 'sha256:16785fe235379d8af90210ffd5d6f410c50c8a14ddd7c5444d5e4db5f8d783d2',
        effective_on: '2022-08-31T00:00:00Z',
        tag: 'f54fb70bcdd88e4767375249d31bf2532cd5aaed-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:16785fe235379d8af90210ffd5d6f410c50c8a14ddd7c5444d5e4db5f8d783d2',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=f54fb70bcdd88e4767375249d31bf2532cd5aaed-2',
        shortDigest: '16785fe23537',
      },
      {
        digest: 'sha256:5792d7e992a01f46a3a5fc3d49e80db8686d496fe0ecec158975a998f63af70e',
        effective_on: '2022-08-31T00:00:00Z',
        tag: 'f54fb70bcdd88e4767375249d31bf2532cd5aaed-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:5792d7e992a01f46a3a5fc3d49e80db8686d496fe0ecec158975a998f63af70e',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=f54fb70bcdd88e4767375249d31bf2532cd5aaed-1',
        shortDigest: '5792d7e992a0',
      },
      {
        digest: 'sha256:275eee659c7bc99c598c04a7e98a8d6fdc159cca83f76757669aa55a2ee59daf',
        effective_on: '2022-08-31T00:00:00Z',
        tag: '16949b68be9d3ae7e849a11c29be89b353c951ef-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:275eee659c7bc99c598c04a7e98a8d6fdc159cca83f76757669aa55a2ee59daf',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=16949b68be9d3ae7e849a11c29be89b353c951ef-3',
        shortDigest: '275eee659c7b',
      },
      {
        digest: 'sha256:1092dc019befdf7a72ac282f760cf9f6c19b806b6879c6444f7565ea2241021a',
        effective_on: '2022-08-31T00:00:00Z',
        tag: '16949b68be9d3ae7e849a11c29be89b353c951ef-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:1092dc019befdf7a72ac282f760cf9f6c19b806b6879c6444f7565ea2241021a',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=16949b68be9d3ae7e849a11c29be89b353c951ef-2',
        shortDigest: '1092dc019bef',
      },
      {
        digest: 'sha256:cc8a72b8896917746ece40abc81e9b104ca57292feda267937a3497475afb862',
        effective_on: '2022-08-31T00:00:00Z',
        tag: '16949b68be9d3ae7e849a11c29be89b353c951ef-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:cc8a72b8896917746ece40abc81e9b104ca57292feda267937a3497475afb862',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=16949b68be9d3ae7e849a11c29be89b353c951ef-1',
        shortDigest: 'cc8a72b88969',
      },
      {
        digest: 'sha256:820d5ab50d9933b7d80269ba7925e528ec9bf62a94448cde3bcbe52c8fcd720a',
        effective_on: '2022-08-29T00:00:00Z',
        tag: 'a834e02a4178135758c32d6770e800270a1ed070-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:820d5ab50d9933b7d80269ba7925e528ec9bf62a94448cde3bcbe52c8fcd720a',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=a834e02a4178135758c32d6770e800270a1ed070-3',
        shortDigest: '820d5ab50d99',
      },
      {
        digest: 'sha256:217690604135573d312522f828ea32567c4a1db3b23c7ff01ba8fffa6d74d44e',
        effective_on: '2022-08-29T00:00:00Z',
        tag: 'a834e02a4178135758c32d6770e800270a1ed070-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:217690604135573d312522f828ea32567c4a1db3b23c7ff01ba8fffa6d74d44e',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=a834e02a4178135758c32d6770e800270a1ed070-2',
        shortDigest: '217690604135',
      },
      {
        digest: 'sha256:8249c38a1adfc2206d603808b40be207e17eec82a82182fc6df1bf9ade32a64f',
        effective_on: '2022-08-29T00:00:00Z',
        tag: 'a834e02a4178135758c32d6770e800270a1ed070-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:8249c38a1adfc2206d603808b40be207e17eec82a82182fc6df1bf9ade32a64f',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=a834e02a4178135758c32d6770e800270a1ed070-1',
        shortDigest: '8249c38a1adf',
      },
      {
        digest: 'sha256:63a10090998b87913e3a0ef6fdd97e3d8670f2788376be976cb255af4f5cd061',
        effective_on: '2022-08-19T00:00:00Z',
        tag: '0e0b28716550e1adc50443084adecec67f1748ef-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:63a10090998b87913e3a0ef6fdd97e3d8670f2788376be976cb255af4f5cd061',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=0e0b28716550e1adc50443084adecec67f1748ef-3',
        shortDigest: '63a10090998b',
      },
      {
        digest: 'sha256:a7ac6cd0e4dd122326d2be498d76e9f1e438a7fc6cb3b6a77f1f1dfee6af0383',
        effective_on: '2022-08-19T00:00:00Z',
        tag: '0e0b28716550e1adc50443084adecec67f1748ef-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:a7ac6cd0e4dd122326d2be498d76e9f1e438a7fc6cb3b6a77f1f1dfee6af0383',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=0e0b28716550e1adc50443084adecec67f1748ef-2',
        shortDigest: 'a7ac6cd0e4dd',
      },
      {
        digest: 'sha256:b8a5bf5a14fff48766126b14f7d8864f4e4321e0b895ebb280b04e2abe82609c',
        effective_on: '2022-08-19T00:00:00Z',
        tag: '0e0b28716550e1adc50443084adecec67f1748ef-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:b8a5bf5a14fff48766126b14f7d8864f4e4321e0b895ebb280b04e2abe82609c',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=0e0b28716550e1adc50443084adecec67f1748ef-1',
        shortDigest: 'b8a5bf5a14ff',
      },
      {
        digest: 'sha256:25fda7f6c96e943bd20be0acdbfb421e557316dbb341fd8538084e6ec77eaeb4',
        effective_on: '2022-08-19T00:00:00Z',
        tag: '7151d2167bbb7a73af9f45049bba4e0e477f73f0-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:25fda7f6c96e943bd20be0acdbfb421e557316dbb341fd8538084e6ec77eaeb4',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=7151d2167bbb7a73af9f45049bba4e0e477f73f0-3',
        shortDigest: '25fda7f6c96e',
      },
      {
        digest: 'sha256:a7ac6cd0e4dd122326d2be498d76e9f1e438a7fc6cb3b6a77f1f1dfee6af0383',
        effective_on: '2022-08-19T00:00:00Z',
        tag: '7151d2167bbb7a73af9f45049bba4e0e477f73f0-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:a7ac6cd0e4dd122326d2be498d76e9f1e438a7fc6cb3b6a77f1f1dfee6af0383',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=7151d2167bbb7a73af9f45049bba4e0e477f73f0-2',
        shortDigest: 'a7ac6cd0e4dd',
      },
      {
        digest: 'sha256:639dd5e9776729d7fe9d6e2b50c86eeef677e11485ed63c2e50f76b2cc8a61d9',
        effective_on: '2022-08-19T00:00:00Z',
        tag: '7151d2167bbb7a73af9f45049bba4e0e477f73f0-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:639dd5e9776729d7fe9d6e2b50c86eeef677e11485ed63c2e50f76b2cc8a61d9',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=7151d2167bbb7a73af9f45049bba4e0e477f73f0-1',
        shortDigest: '639dd5e97767',
      },
      {
        digest: 'sha256:98691c48d2aed65db36e03cbfc19816516f6e8876d30bcd3dbeea1772f5f1ae8',
        effective_on: '2022-08-19T00:00:00Z',
        tag: '8213b2a36cbb64604491db3f4e72325c4bbb7cc3-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:98691c48d2aed65db36e03cbfc19816516f6e8876d30bcd3dbeea1772f5f1ae8',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=8213b2a36cbb64604491db3f4e72325c4bbb7cc3-3',
        shortDigest: '98691c48d2ae',
      },
      {
        digest: 'sha256:a7ac6cd0e4dd122326d2be498d76e9f1e438a7fc6cb3b6a77f1f1dfee6af0383',
        effective_on: '2022-08-19T00:00:00Z',
        tag: '8213b2a36cbb64604491db3f4e72325c4bbb7cc3-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:a7ac6cd0e4dd122326d2be498d76e9f1e438a7fc6cb3b6a77f1f1dfee6af0383',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=8213b2a36cbb64604491db3f4e72325c4bbb7cc3-2',
        shortDigest: 'a7ac6cd0e4dd',
      },
      {
        digest: 'sha256:19c958326a5cca18de24c2a3e78b65ce6fd6af39bed9b77c2d84ae2c95401d39',
        effective_on: '2022-08-19T00:00:00Z',
        tag: '8213b2a36cbb64604491db3f4e72325c4bbb7cc3-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:19c958326a5cca18de24c2a3e78b65ce6fd6af39bed9b77c2d84ae2c95401d39',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=8213b2a36cbb64604491db3f4e72325c4bbb7cc3-1',
        shortDigest: '19c958326a5c',
      },
      {
        digest: 'sha256:b5e8d7bd73c39c0570686facb5b29eefac6e07a58508117908719a76a86b1876',
        effective_on: '2022-08-18T00:00:00Z',
        tag: 'b7a9f6f780f96580a2b214f63b9dee9677eb7867-3',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:b5e8d7bd73c39c0570686facb5b29eefac6e07a58508117908719a76a86b1876',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=b7a9f6f780f96580a2b214f63b9dee9677eb7867-3',
        shortDigest: 'b5e8d7bd73c3',
      },
      {
        digest: 'sha256:a7ac6cd0e4dd122326d2be498d76e9f1e438a7fc6cb3b6a77f1f1dfee6af0383',
        effective_on: '2022-08-18T00:00:00Z',
        tag: 'b7a9f6f780f96580a2b214f63b9dee9677eb7867-2',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:a7ac6cd0e4dd122326d2be498d76e9f1e438a7fc6cb3b6a77f1f1dfee6af0383',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=b7a9f6f780f96580a2b214f63b9dee9677eb7867-2',
        shortDigest: 'a7ac6cd0e4dd',
      },
      {
        digest: 'sha256:33cb53428e87d9ed73c864f9531a7ba4edc6fe8f94d7f5f49eb855da8f11e5ad',
        effective_on: '2022-08-18T00:00:00Z',
        tag: 'b7a9f6f780f96580a2b214f63b9dee9677eb7867-1',
        digestUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks/manifest/sha256:33cb53428e87d9ed73c864f9531a7ba4edc6fe8f94d7f5f49eb855da8f11e5ad',
        tagUrl:
          'https://quay.io/repository/redhat-appstudio/appstudio-tasks?tab=tags&tag=b7a9f6f780f96580a2b214f63b9dee9677eb7867-1',
        shortDigest: '33cb53428e87',
      },
    ],
  },
  pipelinePackages: {
    'policy.pipeline.basic': {
      shortName: 'basic',
      fullName: 'policy.pipeline.basic',
      title: 'Pipeline definition sanity checks',
      description:
        'Currently there is just a check to confirm the input\nappears to be a Pipeline definition. We may add additional\nsanity checks in future.',
    },
    'policy.pipeline.required_tasks': {
      shortName: 'required_tasks',
      fullName: 'policy.pipeline.required_tasks',
      title: 'Required tasks',
      description:
        'HACBS expects that certain tests are going to be run during image builds.\nThis package includes some rules to confirm that the pipeline definition\nincludes the Tekton tasks to run those required tests.',
    },
    'policy.pipeline.task_bundle': {
      shortName: 'task_bundle',
      fullName: 'policy.pipeline.task_bundle',
      title: 'Task bundle',
      description:
        "To be able to reproduce and audit builds accurately it's important\nto know exactly what happens during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks in a Pipeline definition are defined in task\nbundles, and that the task bundles are from the list of known\nand trusted bundles.",
    },
  },
  releasePackages: {
    'policy.release.attestation_type': {
      shortName: 'attestation_type',
      fullName: 'policy.release.attestation_type',
      title: 'Attestation type',
      description: "Sanity checks related to the format of the image build's attestation.",
    },
    'policy.release.authorization': {
      shortName: 'authorization',
      fullName: 'policy.release.authorization',
      title: 'Authorization',
      description:
        'This package contains rules to check that the image is signed-off\nfor release. There are different ways of providing that sign-off\nauthorization.\n\nTODO: Document the ways that release authorization can be provided.',
    },
    'policy.release.java': {
      shortName: 'java',
      fullName: 'policy.release.java',
      title: 'Java dependency checks',
      description:
        'This package contains a rule to confirm that all Java dependencies\nwere rebuilt in house rather than imported directly from potentially\nuntrusted respositories.',
    },
    'policy.release.not_useful': {
      shortName: 'not_useful',
      fullName: 'policy.release.not_useful',
      title: 'Not useful',
      description:
        'A package containing a bogus test useful for early testing and demos.\n\nTODO: Delete me',
    },
    'policy.release.step_image_registries': {
      shortName: 'step_image_registries',
      fullName: 'policy.release.step_image_registries',
      title: 'Step image registries',
      description:
        "This package contains a rule to ensure that each task in the image's\nbuild pipeline ran using a container image from a known and presumably\ntrusted source.",
    },
    'policy.release.attestation_task_bundle': {
      shortName: 'attestation_task_bundle',
      fullName: 'policy.release.attestation_task_bundle',
      title: 'Task bundle checks',
      description:
        "To be able to reproduce and audit builds accurately it's important\nto know exactly what happened during the build. To do this\nEnterprise Contract requires that all tasks are defined in a set of\nknown and trusted task bundles. This package includes rules to\nconfirm that the tasks that built the image were defined in task\nbundles, and that the task bundles used are from the list of known\nand trusted bundles.",
    },
    'policy.release.tasks': {
      shortName: 'tasks',
      fullName: 'policy.release.tasks',
      title: 'Tasks',
      description:
        'Enterprise Contract expects that a set of tasks were included\nin the pipeline build for each image to be released.\nThis package includes a set of rules to verify that the expected\ntasks ran in the pipeline when the image was built.',
    },
    'policy.release.test': {
      shortName: 'test',
      fullName: 'policy.release.test',
      title: 'Test',
      description:
        'Enterprise Contract requires that each build was subjected\nto a set of tests and that those tests all passed. This package\nincludes a set of rules to verify that.\n\nTODO: Document how you can skip the requirement for individual\ntests if needed using the `non_blocking_rule` configuration.',
    },
  },
};
