import React from 'react';
import './SampleComponent.scss';

/**
 * This is a dumb component that only recieves properties from a smart component.
 * Dumb components are usually functions and not classes.
 *
 * @param props the props given by the smart component.
 */
const SampleComponent: React.FC<{ children: React.ReactNode }> = (props) => {
  return <span className="sample-component"> {props.children} </span>;
};

export default SampleComponent;
