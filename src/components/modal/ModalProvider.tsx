import React from 'react';
import { ModalLauncher } from './createModalLauncher';
import { ModalPortal } from './ModalPortal';

type ModalContextType = <T = {}>(launcher: ModalLauncher) => { closed?: Promise<T> };

const ModalContext = React.createContext<ModalContextType>(null);

type ModalProviderProps = {
  children: React.ReactNode;
};

export const useModalLauncher = () => React.useContext<ModalContextType>(ModalContext);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modal, setModal] = React.useState<React.ReactElement>();

  const showModal = React.useCallback(<T extends {}>(launcherCallback): { closed?: Promise<T> } => {
    const closed = new Promise<T>((resolve) => {
      const handleClose = (obj?: T) => {
        setModal(null);
        resolve(obj);
      };
      const element = launcherCallback(handleClose);
      setModal(element);
    });
    return { closed };
  }, []);

  return (
    <>
      <ModalPortal />
      <ModalContext.Provider value={showModal}>{children}</ModalContext.Provider>
      {modal}
    </>
  );
};
