import React from 'react';
import classnames from 'classnames';

interface PageBodyProps {
  children?: React.ReactNode;
  flexLayout?: boolean;
}

const PageBody: React.FC<React.PropsWithChildren<PageBodyProps>> = ({ children, flexLayout }) => (
  <div
    className={classnames('pane-body', { 'page-body': flexLayout })}
    style={{ paddingBottom: 0 }}
    data-test="page-body"
  >
    {children}
  </div>
);

export default PageBody;
