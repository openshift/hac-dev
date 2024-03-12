import * as React from 'react';
import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import { Formik } from 'formik';
import * as yup from 'yup';
import { ComponentProps } from '../../../../modal/createModalLauncher';
import BugFormContent from './BugFormContent';

type AddBugModalProps = ComponentProps & {
  bugArrayHelper: (values) => void;
};

const bugFormSchema = yup.object({
  issueKey: yup.string().required('Required'),
  url: yup.string().required('Required'),
});

export const AddBugModal: React.FC<React.PropsWithChildren<AddBugModalProps>> = ({
  onClose,
  bugArrayHelper,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = React.useState(false);
  const dateRef = React.useRef(null);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onEscapePress = (event: KeyboardEvent) => {
    if (dateRef && dateRef.current && dateRef.current.isCalendarOpen) {
      dateRef.current.toggleCalendar(false, event.key);
    } else if (isTimePickerOpen) {
      setIsTimePickerOpen(false);
    } else {
      handleModalToggle();
    }
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
      <Button variant="primary" onClick={handleModalToggle}>
        Add a bug
      </Button>
      <Modal
        id="date-time-picker-modal"
        variant={ModalVariant.medium}
        title="Add a bug fix"
        isOpen={isModalOpen}
        onEscapePress={onEscapePress}
        onClose={handleModalToggle}
      >
        <Formik
          onSubmit={setValues}
          initialValues={{ issueKey: '', url: '', summary: '', uploadDate: '' }}
          validationSchema={bugFormSchema}
        >
          <BugFormContent modalToggle={handleModalToggle} />
        </Formik>
      </Modal>
    </>
  );
};
