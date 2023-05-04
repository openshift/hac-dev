import * as React from 'react';
import { CatalogItem } from '@openshift/dynamic-plugin-sdk-extensions';
import {
  Card,
  CardHeader,
  CardActions,
  CardTitle,
  CardBody,
  CardFooter,
  Badge,
  ButtonVariant,
  Button,
  Divider,
  TextContent,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons/dist/esm/icons/external-link-alt-icon';
import { ArrowRightIcon } from '@patternfly/react-icons/dist/js/icons/arrow-right-icon';
import { SampleAttrs } from '../utils/useDevfileSamples';

type SampleCardProps = {
  sample: CatalogItem<SampleAttrs>;
  onSampleImport: (url: string, name: string) => void;
};

const SampleCard: React.FC<SampleCardProps> = ({ sample, onSampleImport }) => {
  const { icon, name, tags, description, attributes } = sample;

  const sourceUrl = (attributes as SampleAttrs)?.git?.remotes?.origin;

  const badges = tags?.map((tag) => (
    <Badge key={tag} isRead>
      {tag}
    </Badge>
  ));

  const handleClick = React.useCallback(() => {
    onSampleImport(sourceUrl, name);
  }, [name, onSampleImport, sourceUrl]);

  return (
    <Card isFlat style={{ height: '100%' }} data-test={`${sample.type}-${sample.name}`}>
      <CardHeader>
        {icon?.url && (
          <img
            className="catalog-tile-pf-icon"
            src={icon.url}
            alt={name}
            style={{ maxWidth: '60px' }}
          />
        )}
        {badges.length > 0 && <CardActions>{badges}</CardActions>}
      </CardHeader>
      <CardTitle>{name}</CardTitle>
      <CardBody>
        <TextContent>{description}</TextContent>
      </CardBody>
      <CardFooter>
        <Button
          variant="link"
          isInline
          iconPosition="right"
          icon={<ExternalLinkAltIcon style={{ marginLeft: 'var(--pf-global--spacer--xs)' }} />}
          onClick={(e) => e.stopPropagation()}
          component={(props) => <a {...props} href={sourceUrl} target="_blank" rel="noreferrer" />}
        >
          Open Git repository
        </Button>
      </CardFooter>
      <Divider />
      <CardFooter>
        <Button
          data-test={`import-sample-${name}`}
          variant={ButtonVariant.link}
          isInline
          onClick={handleClick}
        >
          Import sample <ArrowRightIcon />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SampleCard;
