import * as React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardTitle,
  PageSection,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import CloseIcon from '@patternfly/react-icons/dist/js/icons/close-icon';
import { useLocalStorage } from '../../hooks';

type GettingStartedCardProps = {
  imgClassName?: string;
  localStorageKey: string;
  title: string;
  imgSrc?: string;
  imgAlt?: string;
};

const LOCAL_STORAGE_KEY = 'getting-started-card';

export const GettingStartedCard: React.FC<GettingStartedCardProps> = ({
  imgClassName,
  localStorageKey,
  title,
  imgSrc,
  imgAlt,
  children,
}) => {
  const [storageKeys, setStorageKeys] =
    useLocalStorage<{ [key: string]: boolean }>(LOCAL_STORAGE_KEY);

  const keys = storageKeys && typeof storageKeys === 'object' ? storageKeys : {};
  const isDismissed = keys[localStorageKey];

  return (
    !isDismissed && (
      <PageSection>
        <Card>
          <Split>
            {imgSrc && (
              <SplitItem className={imgClassName}>
                <img src={imgSrc} alt={imgAlt} />
              </SplitItem>
            )}
            <SplitItem isFilled>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardActions>
                  <Button
                    variant="plain"
                    aria-label="close"
                    onClick={() => setStorageKeys({ ...keys, [localStorageKey]: true })}
                  >
                    <CloseIcon />
                  </Button>
                </CardActions>
              </CardHeader>
              <CardBody>{children}</CardBody>
            </SplitItem>
          </Split>
        </Card>
      </PageSection>
    )
  );
};
