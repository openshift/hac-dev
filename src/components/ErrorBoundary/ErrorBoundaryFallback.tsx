import React from 'react';
import {
  ClipboardCopy,
  ClipboardCopyVariant,
  ExpandableSection,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import PageLayout from '../PageLayout/PageLayout';
import { ErrorBoundaryFallbackProps } from './ErrorBoundary';

export const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = (props) => {
  return (
    <PageSection variant={PageSectionVariants.light}>
      <PageLayout title="Oh no! Something went wrong.">
        <PageSection>
          <ExpandableSection toggleText="Show details">
            <TextContent>
              <Text component={TextVariants.h3}>{props.title}</Text>

              <Text component={TextVariants.h4}>Description:</Text>
              <Text component={TextVariants.pre}>{props.errorMessage}</Text>

              <Text component={TextVariants.h4}>Component trace:</Text>
              <ClipboardCopy
                tabIndex={0}
                variant={ClipboardCopyVariant.expansion}
                hoverTip="Copy"
                clickTip="Copied"
                isReadOnly
                isExpanded
                isCode
              >
                {props.componentStack.trim()}
              </ClipboardCopy>

              <Text component={TextVariants.h4}>Stack trace:</Text>
              <ClipboardCopy
                variant={ClipboardCopyVariant.expansion}
                hoverTip="Copy"
                clickTip="Copied"
                isReadOnly
                isExpanded
                isCode
              >
                {props.stack.trim()}
              </ClipboardCopy>
            </TextContent>
          </ExpandableSection>
        </PageSection>
      </PageLayout>
    </PageSection>
  );
};
