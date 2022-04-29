import * as React from 'react';
import * as ReactDOM from 'react-dom';

export const ModalPortal: React.FC = () => {
  const element = React.useMemo(() => {
    return <div id="hacDev-modal-container" className="hacDev" />;
  }, []);

  return ReactDOM.createPortal(element, document.body);
};
