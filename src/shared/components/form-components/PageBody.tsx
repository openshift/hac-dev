import React from 'react';
import classnames from 'classnames';

interface PageBodyProps {
  children?: React.ReactNode;
  flexLayout?: boolean;
}

const PageBody: React.FC<PageBodyProps> = ({ children, flexLayout }) => (
  <div
    className={classnames('hacDev-m-pane__body', { 'hacDev-m-page__body': flexLayout })}
    style={{ paddingBottom: 0 }}
  >
    {children}
  </div>
);

export default PageBody;
