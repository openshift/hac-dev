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
import { createApplication, createComponent } from '../..//utils/create-utils';
import { FormFooter } from '../../shared';
import { useFormValues } from '../form-context';
import { Page } from '../Page/Page';
import { useWizardContext } from '../Wizard/Wizard';
import './ReviewComponentsPage.scss';

export const ReviewComponentsPage: React.FC = () => {
  const wizardContext = useWizardContext();
  const [formState, setFormState] = useFormValues();
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);

  const handleSubmit = React.useCallback(() => {
    setIsSubmitting(true);
    createApplication(formState.application).then((applicationData) => {
      // eslint-disable-next-line no-console
      console.log('###############- Application created', applicationData);
      createComponent(
        {
          name: formState.component.name,
          gitRepo: formState.component.attributes.git.remotes.origin,
        },
        applicationData?.metadata?.name,
      ).then((componentData) => {
        // eslint-disable-next-line no-console
        console.log('###############- Component created', componentData);
      });
    });
  }, [formState]);

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
              <a
                href={formState.component.attributes.git.remotes.origin}
                target="_blank"
                rel="noreferrer"
              >
                {formState.component.attributes.git.remotes.origin}
              </a>
            </FlexItem>
          </Flex>
        </CardExpandableContent>
      </Card>
      <FormFooter
        submitLabel="Create"
        resetLabel="Back"
        handleReset={wizardContext.handleBack}
        handleCancel={() => {
          wizardContext.handleReset();
          setFormState({});
        }}
        handleSubmit={handleSubmit}
        isSubmitting={false}
        disableSubmit={isSubmitting}
        errorMessage={undefined}
      />
    </Page>
  );
};
