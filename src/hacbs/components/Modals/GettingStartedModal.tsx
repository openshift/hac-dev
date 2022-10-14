import * as React from 'react';
import { useK8sWatchResource } from '@openshift/dynamic-plugin-sdk-utils';
import {
  Button,
  Modal,
  ModalVariant,
  Title,
  Text,
  TextVariants,
  Alert,
  AlertActionLink,
} from '@patternfly/react-core';
import classnames from 'classnames';
import ExternalLink from '../../../shared/components/links/ExternalLink';
import { useNamespace } from '../../../utils/namespace-context-utils';
import { EnterpriseContractPolicyGroupVersionKind } from '../../models';
import { EnterpriseContractPolicyKind } from '../../types/enterpriseContractPolicy';
import ecUrl from './imgs/Enterprise-contract.svg';
import itUrl from './imgs/Integration-test.svg';

type GettingStartedModalProps = {
  imgClassName?: string;
  title?: string;
  imgSrc?: string;
  imgAlt?: string;
};

type Level = {
  header: {
    title: string;
    subText?: string;
    image?: {
      imgSrc: string;
      imgAlt: string;
      imgClass?: string;
    };
  };
  content: {
    visualization?: React.ReactElement;
    sectionHeading?: string;
    text: { key: number; jsx: React.ReactElement }[];
  };
  preFooter?: React.ReactElement;
  footerButton: { title: string; cta: any };
};

export const LOCAL_STORAGE_KEY = 'hacbs/getting-started-modal';

export const GettingStartedModal: React.FC<GettingStartedModalProps> = ({
  imgClassName,
  imgSrc,
  imgAlt,
}) => {
  const isVisited = localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
  const [isDismissed, setIsDismissed] = React.useState<boolean>(isVisited);
  const [currentLevel, setCurrentLevel] = React.useState<number>(0);
  const namespace = useNamespace();

  const [enterpriseContractPolicy, policyLoaded] = useK8sWatchResource<
    EnterpriseContractPolicyKind[]
  >({
    groupVersionKind: EnterpriseContractPolicyGroupVersionKind,
    namespace,
    isList: true,
    limit: 1,
  });

  const levels: Level[] = [
    {
      header: {
        title: 'Welcome to App Factory',
        image: { imgSrc, imgAlt, imgClass: imgClassName },
      },
      content: {
        sectionHeading: 'One station to productization',
        text: [
          {
            key: 1,
            jsx: (
              <>
                Complete automation, from commit to application release, in a single click. Maximize
                your security with our off-the-shelf CI/CD solutions.
              </>
            ),
          },
        ],
      },
      footerButton: { title: 'Next', cta: () => setCurrentLevel(1) },
    },
    {
      header: {
        title: 'How does it work?',
        subText: '1 of 2',
      },
      content: {
        visualization: (
          <div
            className="pf-u-display-flex pf-u-justify-content-center"
            data-test="onboarding-modal--level1viz"
          >
            <img src={ecUrl} alt="Enterprise Contracts" />
          </div>
        ),
        sectionHeading: 'Testing apps against Enterprise Contracts',
        text: [
          {
            key: 1,
            jsx: (
              <>
                An Enterprise Contract (EC) is a set of release policies applied on your release
                target, also known as <ExternalLink href="#" text="managed environment" />.
              </>
            ),
          },
          {
            key: 2,
            jsx: (
              <>
                All your builds are checked against these release policies so that you know if
                changes will be needed before releasing an application to customers.
              </>
            ),
          },
        ],
      },
      preFooter:
        policyLoaded && enterpriseContractPolicy[0]?.spec.sources[0]?.git?.repository ? (
          <Alert
            variant="success"
            isInline
            title="This workspace validates releases with an enterprise contract"
            data-test="onboarding-modal-level1alert"
            actionLinks={
              <AlertActionLink href={enterpriseContractPolicy[0]?.spec.sources[0].git.repository}>
                {"View my org's enterprise contracts"}
              </AlertActionLink>
            }
          />
        ) : undefined,
      footerButton: { title: 'Next', cta: () => setCurrentLevel(2) },
    },
    {
      header: {
        title: 'How it works',
        subText: '2 of 2',
      },
      content: {
        visualization: (
          <div className="pf-u-display-flex pf-u-justify-content-center">
            <img src={itUrl} alt="Integration tests" />
          </div>
        ),
        sectionHeading: 'Adding integration tests',
        text: [
          {
            key: 1,
            jsx: (
              <>
                Before attempting to release, you can add your own integration tests for automatic
                release eligibility evaluation.
              </>
            ),
          },
        ],
      },
      footerButton: {
        title: 'Get started',
        cta: () => {
          localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
          setIsDismissed(true);
        },
      },
    },
  ];

  const headerData = levels[currentLevel].header;
  const header = [
    <>
      <Title className="pf-u-text-align-center" headingLevel="h2">
        {headerData.title}
      </Title>
      {headerData.subText && (
        <Text className="pf-u-text-align-center" component={TextVariants.p}>
          {headerData.subText}
        </Text>
      )}
      {headerData.image?.imgSrc && (
        <div
          className={classnames(
            'pf-u-display-flex pf-u-justify-content-center pf-u-flex-fill',
            imgClassName,
          )}
        >
          <img src={imgSrc} alt={imgAlt} />
        </div>
      )}
    </>,
  ];

  const prefooterData = levels[currentLevel].preFooter;
  const contentData = levels[currentLevel].content;
  const content = (
    <React.Fragment>
      {contentData.visualization && (
        <section className="pf-c-tab-content pf-m-light-300 pf-u-m-xl pf-u-p-xl" role="tabpanel">
          <div className="pf-c-tab-content__body">{contentData.visualization}</div>
        </section>
      )}
      {contentData.sectionHeading && (
        <Text className="pf-u-mt-md pf-u-mb-lg" key="heading-text" component={TextVariants.h3}>
          <b>{contentData.sectionHeading}</b>
        </Text>
      )}
      {contentData.text.map((line) => (
        <Text component={TextVariants.p} key={line.key} className="pf-u-mt-sm">
          {line.jsx}
        </Text>
      ))}
      {prefooterData && (
        <div className="pf-u-mt-xl pf-u-mb-md pf-u-text-align-left">{prefooterData}</div>
      )}
    </React.Fragment>
  );

  const footerData = levels[currentLevel].footerButton;
  const footer = [
    <>
      <div className="pf-u-display-flex pf-u-justify-content-center pf-u-flex-fill">
        <Button aria-label="get started" onClick={() => footerData.cta()}>
          {footerData.title}
        </Button>
      </div>
    </>,
  ];

  return (
    <Modal
      aria-label="getting-started-modal"
      variant={ModalVariant.small}
      appendTo={document.querySelector('#hacDev-modal-container') as HTMLElement}
      header={header}
      footer={footer}
      isOpen={!isDismissed}
      showClose={false}
      data-test="hacbs-getting-started-modal"
    >
      <div className="pf-u-text-align-center">{content}</div>
    </Modal>
  );
};
