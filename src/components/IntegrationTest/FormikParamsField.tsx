import * as React from 'react';
import {
  Flex,
  FlexItem,
  TextContent,
  DataList,
  DataListItem,
  DataListToggle,
  DataListContent,
  Button,
  Alert,
  AlertVariant,
  InputGroup,
  FormGroup,
  DataListItemRow,
  DataListItemCells,
  DataListCell,
  CardHeader,
  Card,
  CardExpandableContent,
  CardBody,
} from '@patternfly/react-core';
import { MinusCircleIcon } from '@patternfly/react-icons/dist/js/icons/minus-circle-icon';
import { PlusCircleIcon } from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import { FieldArray, useField } from 'formik';
import { InputField } from '../../shared';
import { Param } from '../../types/coreBuildService';

interface IntegrationTestParamsProps {
  heading?: React.ReactNode;
  fieldName: string;
  initExpanded?: boolean;
}

const IntegrationTestParams: React.FC<React.PropsWithChildren<IntegrationTestParamsProps>> = ({
  heading,
  fieldName,
  initExpanded = false,
}) => {
  const [, { value: parameters, error }] = useField<Param[]>(fieldName);

  const initExpandedState = React.useMemo(() => {
    const state = [];
    for (let i = 0; i < parameters?.length; i++) {
      state.push(false);
    }
    return state;
  }, [parameters]);

  const [expanded, setExpanded] = React.useState<boolean[]>(initExpandedState);
  const [paramExpanded, setParamExpanded] = React.useState<boolean>(initExpanded);

  const toggleExpandedState = (i) => {
    const state = [...expanded];
    state[i] = !state[i];
    setExpanded(state);
  };

  const addParam = () => {
    const state = [...expanded, true];
    setExpanded(state);
  };

  const removeParam = (i) => {
    const state = [...expanded];
    state.splice(i, 1);
    setExpanded(state);
  };

  return (
    <div style={{ maxWidth: '750px' }}>
      <Card
        isSelected={paramExpanded}
        isExpanded={paramExpanded}
        data-test="its-param-field"
        isCompact
        isPlain
      >
        <CardHeader
          onExpand={() => setParamExpanded((v) => !v)}
          toggleButtonProps={{
            id: `toggle-${name}`,
            'aria-label': name,
            'aria-labelledby': `review-${name} toggle-${name}`,
            'aria-expanded': paramExpanded,
            'data-test': `${name}-toggle-button`,
            className: 'pf-v5-u-pr-xs pf-v5-u-pl-sm',
          }}
          className="pf-v5-u-pl-xs pf-v5-u-pr-xs"
        >
          {heading ?? 'Parameters'}
          {error && (
            <Alert data-test="its-param-error-alert" title={error} variant={AlertVariant.danger} />
          )}
        </CardHeader>
        <CardExpandableContent>
          <CardBody className="review-component-card__card-body">
            <FieldArray
              name={fieldName}
              render={(paramArrayHelpers) => (
                <>
                  <DataList aria-label="parameter-list" data-test="its-param-list">
                    {Array.isArray(parameters) &&
                      parameters.length > 0 &&
                      parameters.map((p, i) => {
                        return (
                          <DataListItem
                            key={`parameter-${i}`}
                            isExpanded={expanded[i]}
                            data-test={`its-param-${i + 1}`}
                          >
                            <DataListItemRow className="pf-v5-u-pl-0">
                              <DataListToggle
                                id={p.name}
                                data-testid={`${p.name}-toggle`}
                                onClick={() => toggleExpandedState(i)}
                                isExpanded={expanded[i]}
                                data-test={`expand-param-${i + 1}`}
                                className="pf-v5-u-mr-0"
                              />
                              <DataListItemCells
                                dataListCells={[
                                  <DataListCell key="param-title" width={5}>
                                    <TextContent>{`Parameter${i + 1}`}</TextContent>
                                  </DataListCell>,

                                  <DataListCell key="remove-param-button" width={3}>
                                    <Button
                                      isInline
                                      type="button"
                                      variant="link"
                                      data-test={`remove-param-${i + 1}`}
                                      icon={<MinusCircleIcon />}
                                      onClick={() => {
                                        removeParam(i);
                                        paramArrayHelpers.remove(i);
                                      }}
                                    >
                                      Remove parameter
                                    </Button>
                                  </DataListCell>,
                                ]}
                              />
                            </DataListItemRow>
                            <DataListContent
                              hasNoPadding
                              aria-label="list-item-content"
                              isHidden={!expanded[i]}
                            >
                              <DataListItemRow className="pf-v5-u-pl-0">
                                <DataListItemCells
                                  dataListCells={[
                                    <DataListCell
                                      key="param-name"
                                      width={3}
                                      className="pf-v5-u-pl-xl pf-v5-u-pt-0"
                                    >
                                      <FormGroup label="Name">
                                        <InputField
                                          name={`${fieldName}[${i}].name`}
                                          data-test={`param-${i}-name`}
                                        />
                                      </FormGroup>
                                    </DataListCell>,
                                    <DataListCell
                                      key="param-value"
                                      width={4}
                                      className="pf-v5-u-pl-xl pf-v5-u-pt-0"
                                    >
                                      <FormGroup label="Value">
                                        <FieldArray
                                          name={`${fieldName}[${i}].values`}
                                          render={(valueArrayHelpers) => (
                                            <>
                                              {p.values &&
                                                p.values.length > 0 &&
                                                p.values.map((val, j) => (
                                                  <InputGroup
                                                    key={`value${i}${j}`}
                                                    className="pf-v5-u-mb-md"
                                                  >
                                                    <InputField
                                                      key={`value${i}${j}`}
                                                      name={`${fieldName}[${i}].values[${j}]`}
                                                      data-test={`param-${i}-value-${j}`}
                                                    />
                                                    <Button
                                                      className="pf-v5-u-ml-md"
                                                      isInline
                                                      type="button"
                                                      variant="link"
                                                      isDisabled={p.values.length === 1}
                                                      data-test={`remove-value-${i + 1}-${j + 1}`}
                                                      icon={<MinusCircleIcon />}
                                                      onClick={() => valueArrayHelpers.remove(j)}
                                                    />
                                                  </InputGroup>
                                                ))}
                                              <Button
                                                isInline
                                                type="button"
                                                variant="link"
                                                data-test={`add-value-${i + 1}`}
                                                icon={<PlusCircleIcon />}
                                                onClick={() => valueArrayHelpers.push('')}
                                              >
                                                Add value
                                              </Button>
                                            </>
                                          )}
                                        />
                                      </FormGroup>
                                    </DataListCell>,
                                  ]}
                                />
                              </DataListItemRow>
                            </DataListContent>
                          </DataListItem>
                        );
                      })}
                    <DataListItem>
                      <Flex>
                        <FlexItem className="pf-v5-u-mt-md pf-v5-u-mb-md">
                          <Button
                            isInline
                            type="button"
                            variant="link"
                            data-test="add-param-button"
                            className="pf-v5-u-ml-md"
                            icon={<PlusCircleIcon />}
                            onClick={() => {
                              addParam();
                              paramArrayHelpers.push({
                                name: `param${parameters.length + 1}`,
                                values: [''],
                              });
                            }}
                          >
                            Add parameter
                          </Button>
                        </FlexItem>
                        <Flex flex={{ default: 'flex_3' }}>
                          <FlexItem />
                        </Flex>
                      </Flex>
                    </DataListItem>
                  </DataList>
                </>
              )}
            />
          </CardBody>
        </CardExpandableContent>
      </Card>
    </div>
  );
};

export default IntegrationTestParams;
