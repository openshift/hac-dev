import React from 'react';
import { ModalLauncher } from './createModalLauncher';
import { ModalPortal } from './ModalPortal';

type ModalContextType = (launcher: ModalLauncher) => void;

const ModalContext = React.createContext<ModalContextType>(() => {});

type ModalProviderProps = {
  children: React.ReactNode;
};

export const useModalLauncher = () => React.useContext(ModalContext);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modal, setModal] = React.useState<React.ReactElement>();

  const handleClose = React.useCallback(() => {
    setModal(null);
  }, []);

  const showModal = React.useCallback(
    (launcherCallback) => {
      const element = launcherCallback(handleClose);
      setModal(element);
    },
    [handleClose],
  );

  return (
    <>
      <ModalPortal />
      <ModalContext.Provider value={showModal}>{children}</ModalContext.Provider>
      {modal}
    </>
  );
};
