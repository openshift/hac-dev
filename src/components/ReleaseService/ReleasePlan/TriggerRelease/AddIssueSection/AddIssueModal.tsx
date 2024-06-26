import * as React from 'react';
import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import { Formik } from 'formik';
import * as yup from 'yup';
import { URL_ERROR_MSG, URL_REGEX } from '../../../../../utils/validation-utils';
import { ComponentProps } from '../../../../modal/createModalLauncher';
import BugFormContent from './BugFormContent';
import CVEFormContent from './CVEFormContent';
import { dateFormat } from './UploadDate';

export enum IssueType {
  BUG = 'bug',
  CVE = 'cve',
}

type AddIssueModalProps = ComponentProps & {
  bugArrayHelper: (values) => void;
  issueType: IssueType;
};

const IssueFormSchema = yup.object({
  key: yup.string().required('Required'),
  url: yup.string().matches(URL_REGEX, URL_ERROR_MSG),
});

export const AddIssueModal: React.FC<React.PropsWithChildren<AddIssueModalProps>> = ({
  onClose,
  bugArrayHelper,
  issueType,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const isBug = issueType === IssueType.BUG;

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const setValues = React.useCallback(
    (fields) => {
      bugArrayHelper(fields);
      onClose();
    },
    [onClose, bugArrayHelper],
  );

  return (
    <>
      <Button variant="primary" onClick={handleModalToggle} data-test="modal-launch-btn">
        {isBug ? 'Add a bug' : 'Add a CVE'}
      </Button>
      <Modal
        variant={ModalVariant.medium}
        title={isBug ? 'Add a bug fix' : 'Add a CVE'}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        data-test="add-issue-modal"
      >
        <Formik
          onSubmit={setValues}
          initialValues={
            isBug
              ? { key: '', url: '', summary: '', uploadDate: dateFormat(new Date()) }
              : {
                  key: '',
                  components: [],
                }
          }
          validationSchema={IssueFormSchema}
        >
          {isBug ? (
            <BugFormContent modalToggle={handleModalToggle} />
          ) : (
            <CVEFormContent modalToggle={handleModalToggle} />
          )}
        </Formik>
      </Modal>
    </>
  );
};
