import * as React from 'react';
import PageAccessCheck, { PageAccessCheckProps } from './PageAccessCheck';

type PageAccessProps = Omit<PageAccessCheckProps, 'children'>;

export const withPageAccessCheck =
  <P extends {}>(Component: React.ComponentType<P>) =>
  (pageAccessProps: PageAccessProps) =>
  (props: P) =>
    (
      <PageAccessCheck {...pageAccessProps}>
        <Component {...props} />
      </PageAccessCheck>
    );
