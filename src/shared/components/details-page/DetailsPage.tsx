import * as React from 'react';
import { Page } from '../page';
import SimpleTabNav, { SimpleTab } from '../simple-tab-nav/SimpleTabNav';

export type DetailsPageProps = {
  pageHeading: string;
  tabs: SimpleTab[];
};

const DetailsPage: React.FC<DetailsPageProps> = ({ tabs, pageHeading }) => (
  <Page heading={pageHeading} headingLevel="h2" titleSize="3xl">
    <SimpleTabNav tabs={tabs} />
  </Page>
);

export default DetailsPage;
