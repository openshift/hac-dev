import * as React from 'react';
import {
  Card,
  CardBody,
  Flex,
  FlexItem,
  CardTitle,
  Bullseye,
  TextVariants,
  Divider,
  Text,
} from '@patternfly/react-core';
import overviewInfo1 from '../../imgs/overview/overview-info1.svg';
import overviewInfo2 from '../../imgs/overview/overview-info2.svg';
import overviewInfo3 from '../../imgs/overview/overview-info3.svg';

const InfoBanner = () => (
  <Card isLarge>
    <CardBody style={{ paddingLeft: '16px' }}>
      <Flex
        justifyContent={{ default: 'justifyContentSpaceEvenly' }}
        flexWrap={{ default: 'nowrap' }}
        direction={{ default: 'column', sm: 'row' }}
      >
        <FlexItem flex={{ default: 'flex_1' }}>
          <Card isPlain isCompact>
            <CardTitle>
              <Bullseye>
                <img
                  src={overviewInfo1}
                  alt="OpenShift and Kubernetes"
                  width="30px"
                  height="30px"
                />
              </Bullseye>
            </CardTitle>
            <CardBody>
              <Bullseye>
                <Text component={TextVariants.p}>
                  Start with source code and containerize your applications for OpenShift and
                  Kubernetes
                </Text>
              </Bullseye>
            </CardBody>
          </Card>
        </FlexItem>
        <Divider
          orientation={{
            default: 'vertical',
          }}
        />
        <FlexItem flex={{ default: 'flex_1' }}>
          <Card isPlain isCompact>
            <CardTitle>
              <Bullseye>
                <img src={overviewInfo2} alt="Secure supply chain" width="30px" height="30px" />
              </Bullseye>
            </CardTitle>
            <CardBody>
              <Bullseye>
                Rapidly improve the security of your application&apos;s software supply chain
              </Bullseye>
            </CardBody>
          </Card>
        </FlexItem>
        <Divider
          orientation={{
            default: 'vertical',
          }}
        />
        <FlexItem flex={{ default: 'flex_1' }}>
          <Card isPlain isCompact>
            <CardTitle>
              <Bullseye>
                <img src={overviewInfo3} alt="Cloud deployment" width="30px" height="30px" />
              </Bullseye>
            </CardTitle>
            <CardBody>
              <Bullseye>Simplified deployment across multiple clouds</Bullseye>
            </CardBody>
          </Card>
        </FlexItem>
      </Flex>
    </CardBody>
  </Card>
);

export default InfoBanner;
