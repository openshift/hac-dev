import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageSection, PageSectionTypes, PageSectionVariants } from '@patternfly/react-core';
import { FormikWizard } from 'formik-pf';
import { useWorkspaceInfo } from '../../utils/workspace-context-utils';
import { createCustomizeAllPipelinesModalLauncher } from '../CustomizedPipeline/CustomizePipelinesModal';
import { useModalLauncher } from '../modal/ModalProvider';
import { createResources } from './utils/submit-utils';
import { ImportFormValues, ImportStrategy } from './utils/types';
import { useImportSteps } from './utils/useImportSteps';

import './ImportForm.scss';

type ImportFormProps = {
  applicationName?: string;
};

const ImportForm: React.FunctionComponent<ImportFormProps> = ({ applicationName }) => {
  const navigate = useNavigate();
  const { namespace } = useWorkspaceInfo();
  const [strategy, setStrategy] = React.useState(ImportStrategy.GIT);

  const initialValues: ImportFormValues = {
    application: applicationName || '',
    inAppContext: applicationName ? true : false,
    components: [],
    pipelinesascode: 'manual',
    source: {
      git: {
        url: '',
        context: '',
        revision: '',
      },
    },
    namespace,
    secret: '',
  };

  const steps = useImportSteps(applicationName, strategy, setStrategy);
  const showModal = useModalLauncher();
  const { workspace } = useWorkspaceInfo();

  const handleSubmit = React.useCallback(
    (values: ImportFormValues, formikHelpers) => {
      return createResources(values, strategy)
        .then(({ applicationName: appName, componentNames }) => {
          const doNavigate = () =>
            navigate(`/stonesoup/workspaces/${workspace}/applications/${appName}`);
          if (values.pipelinesascode === 'automatic') {
            showModal(
              createCustomizeAllPipelinesModalLauncher(
                appName,
                namespace,
                (c) => componentNames.includes(c.metadata.name),
                () => {
                  setTimeout(() => doNavigate(), 0);
                },
              ),
            );
          } else {
            doNavigate();
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn('Error while submitting import form:', error);
          formikHelpers.setSubmitting(false);
          formikHelpers.setStatus({ submitError: error.message });
        });
    },
    [navigate, strategy, showModal, namespace, workspace],
  );

  const handleReset = () => {
    navigate(-1);
  };

  return (
    <PageSection
      isFilled
      type={PageSectionTypes.wizard}
      variant={PageSectionVariants.light}
      className="import-form"
    >
      <FormikWizard
        onSubmit={handleSubmit}
        onReset={handleReset}
        initialValues={initialValues}
        steps={steps}
      />
    </PageSection>
  );
};

export default ImportForm;
