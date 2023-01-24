import * as React from 'react';
import { Helmet } from 'react-helmet';

export const HeadTitle: React.FC = ({ children }) => (
  <Helmet>
    <title>{children}</title>
  </Helmet>
);
