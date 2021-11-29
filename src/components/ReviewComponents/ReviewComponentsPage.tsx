import {
  Card,
  CardExpandableContent,
  CardHeader,
  Text,
  TextVariants,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import * as React from 'react';
import { FormFooter } from '../../shared';
import { useFormValues } from '../form-fields/form-context';
import { Page } from '../Page';
import { useWizardContext } from '../Wizard/Wizard';
import './ReviewComponentsPage.scss';

export const ReviewComponentsPage: React.FC = () => {
  const wizardContext = useWizardContext();
  const [formState] = useFormValues();
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  return (
    <Page
      breadcrumbs={[
        { path: '#', name: 'Applications' },
        { path: '#', name: 'Create your application' },
      ]}
      heading="Review your new components"
      description="Review your choices for the application"
    >
      <Card className="hacDev-review-component" isExpanded={isExpanded}>
        <CardHeader
          onExpand={() => setIsExpanded((prevExpanded) => !prevExpanded)}
          toggleButtonProps={{
            'aria-label': `${formState.component.name}`,
            'aria-expanded': isExpanded,
          }}
        >
          <img
            className="hacDev-review-component__image"
            src={formState.component.icon.url}
            alt={formState.component.name}
          />
          <span className="hacDev-review-component__name">{formState.component.name}</span>
        </CardHeader>
        <CardExpandableContent>
          <Flex className="hacDev-review-component__content" direction={{ default: 'column' }}>
            <FlexItem>
              <Text component={TextVariants.p}>{formState.component.description}</Text>
            </FlexItem>
            <FlexItem>
              <b>Git Repo: </b>
              <a href={formState.component.git.remotes.origin} target="_blank" rel="noreferrer">
                {formState.component.git.remotes.origin}
              </a>
            </FlexItem>
          </Flex>
        </CardExpandableContent>
      </Card>
      <FormFooter
        submitLabel="Create"
        resetLabel="Back"
        handleReset={wizardContext.handleBack}
        handleCancel={wizardContext.handleReset}
        handleSubmit={() => {}}
        isSubmitting={false}
        disableSubmit={false}
        errorMessage={undefined}
      />
    </Page>
  );
};
