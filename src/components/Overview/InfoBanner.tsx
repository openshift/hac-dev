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

import './InfoBanner.scss';

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
                <div className="info-banner__circle">
                  <Bullseye>
                    <img
                      src={overviewInfo1}
                      className="info-banner__icon"
                      alt="OpenShift and Kubernetes"
                    />
                  </Bullseye>
                </div>
              </Bullseye>
            </CardTitle>
            <CardBody>
              <Bullseye>
                <Text component={TextVariants.p}>Build artifacts of all kinds from source</Text>
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
                <div className="info-banner__circle">
                  <Bullseye>
                    <img
                      src={overviewInfo2}
                      className="info-banner__icon"
                      alt="Secure supply chain"
                    />
                  </Bullseye>
                </div>
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
                <div className="info-banner__circle">
                  <Bullseye>
                    <img src={overviewInfo3} className="info-banner__icon" alt="Cloud deployment" />
                  </Bullseye>
                </div>
              </Bullseye>
            </CardTitle>
            <CardBody>
              <Bullseye>Catch critical vulnerabilities quickly</Bullseye>
            </CardBody>
          </Card>
        </FlexItem>
      </Flex>
    </CardBody>
  </Card>
);

export default InfoBanner;
