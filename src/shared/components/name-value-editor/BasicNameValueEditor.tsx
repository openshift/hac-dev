import * as React from 'react';
import { Button, Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import MinusCircleIcon from '@patternfly/react-icons/dist/js/icons/minus-circle-icon';
import PlusCircleIcon from '@patternfly/react-icons/dist/js/icons/plus-circle-icon';
import cloneDeep from 'lodash/cloneDeep';
import { NameValueEditorPair } from './types';

import './BasicNameValueEditor.scss';

type PairElementProps = {
  nameString: string;
  valueString: string;
  index: number;
  pair: (string | number)[];
  onChange: (e: React.SyntheticEvent, index: number, type: NameValueEditorPair) => void;
  onRemove: (index: number) => void;
  toolTip?: string;
  readOnly: boolean;
  isEmpty: boolean;
  alwaysAllowRemove: boolean;
};

const PairElement: React.FC<PairElementProps> = ({
  nameString,
  valueString,
  index,
  pair,
  onChange,
  onRemove,
  toolTip,
  readOnly,
  isEmpty,
  alwaysAllowRemove,
}) => {
  const onChangeName = (e: React.SyntheticEvent) => {
    onChange(e, index, NameValueEditorPair.Name);
  };
  const onChangeValue = (e: React.SyntheticEvent) => {
    onChange(e, index, NameValueEditorPair.Value);
  };

  const deleteIcon = (
    <>
      <MinusCircleIcon className="pairs-list__side-btn" />
      <span className="sr-only">Delete</span>
    </>
  );

  return (
    <div className="pairs-list__row" data-test="pairs-list-row">
      <div className="pairs-list__row--name">
        <span className="pairs-list__row--label">Name</span>
        <input
          type="text"
          data-test="pairs-list-name"
          className="pf-c-form-control"
          placeholder={nameString}
          value={pair[NameValueEditorPair.Name]}
          onChange={onChangeName}
          disabled={readOnly}
        />
      </div>
      <div className="pairs-list__row--value">
        <span className="pairs-list__row--label">Value</span>
        <input
          type="text"
          data-test="pairs-list-value"
          className="pf-c-form-control"
          placeholder={valueString}
          value={pair[NameValueEditorPair.Value] || ''}
          onChange={onChangeValue}
          disabled={readOnly}
        />
      </div>
      {!readOnly && (
        <span className="pairs-list__row--remove">
          <Tooltip content={toolTip || 'Remove'}>
            <Button
              type="button"
              data-test="delete-button"
              onClick={() => onRemove(index)}
              isDisabled={isEmpty && !alwaysAllowRemove}
              variant="plain"
            >
              {deleteIcon}
            </Button>
          </Tooltip>
        </span>
      )}
    </div>
  );
};

type NameValueEditorProps = {
  nameString?: string;
  valueString?: string;
  addString?: string;
  readOnly?: boolean;
  nameValueId?: number;
  toolTip?: string;
  nameValuePairs: (string | number)[][];
  updateParentData: (pairs: { nameValuePairs: (string | number)[][] }, nameValueId: number) => void;
  onLastItemRemoved?: () => void;
};

const BasicNameValueEditor: React.FC<NameValueEditorProps> = ({
  nameString = 'Key',
  valueString = 'Value',
  addString = 'Add more',
  readOnly = false,
  nameValueId = 0,
  nameValuePairs,
  onLastItemRemoved,
  updateParentData,
  toolTip,
}) => {
  const onAppend = () => {
    updateParentData(
      { nameValuePairs: nameValuePairs.concat([['', '', nameValuePairs.length]]) },
      nameValueId,
    );
  };

  const onChange = (e, i: number, type: NameValueEditorPair) => {
    const pairs = cloneDeep(nameValuePairs);
    pairs[i][
      type === NameValueEditorPair.Name ? NameValueEditorPair.Name : NameValueEditorPair.Value
    ] = e.target.value;
    updateParentData({ nameValuePairs: pairs }, nameValueId);
  };

  const onRemove = (i: number) => {
    const pairs = cloneDeep(nameValuePairs);
    pairs.splice(i, 1);
    pairs.forEach((values, index) => (values[2] = index)); // update the indices in order.
    updateParentData({ nameValuePairs: pairs.length ? pairs : [['', '', 0]] }, nameValueId);
    if (pairs.length === 0 && !!onLastItemRemoved) {
      onLastItemRemoved();
    }
  };

  const pairElems = nameValuePairs.map((pair, i) => {
    const key = pair[NameValueEditorPair.Index] ?? i;
    const isEmpty = nameValuePairs.length === 1 && nameValuePairs[0].every((value) => !value);

    return (
      <PairElement
        index={i}
        nameString={nameString}
        valueString={valueString}
        readOnly={readOnly}
        key={key}
        pair={pair}
        isEmpty={isEmpty}
        toolTip={toolTip}
        alwaysAllowRemove={!!onLastItemRemoved}
        onChange={onChange}
        onRemove={onRemove}
      />
    );
  });

  return (
    <>
      <Flex className="pairs-list__heading" direction={{ default: 'row' }}>
        <Flex flex={{ default: 'flex_1' }}>
          <FlexItem>{nameString}</FlexItem>
        </Flex>
        <Flex flex={{ default: 'flex_1' }}>
          <FlexItem>{valueString}</FlexItem>
        </Flex>
        <FlexItem className="empty__header" />
      </Flex>
      <div className="pairs-list__elements">{pairElems}</div>
      <Flex direction={{ default: 'row' }} justifyContent={{ default: 'justifyContentFlexStart' }}>
        {readOnly ? null : (
          <FlexItem>
            <Button
              className="pf-m-link--align-left"
              data-test="add-button"
              onClick={onAppend}
              type="button"
              variant="link"
              isInline
            >
              <PlusCircleIcon
                data-test-id="pairs-list__add-icon"
                className="pairs-list__add-icon"
              />
              {addString}
            </Button>
          </FlexItem>
        )}
      </Flex>
    </>
  );
};

export default BasicNameValueEditor;
