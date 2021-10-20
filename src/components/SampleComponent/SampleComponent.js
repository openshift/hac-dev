import React from 'react';
import PropTypes from 'prop-types';
import './SampleComponent.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
const SampleComponent = (props) => {
  return <span className="sample-component"> {props.children} </span>;
};

SampleComponent.displayName = 'SampleComponent';

SampleComponent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

export default SampleComponent;
