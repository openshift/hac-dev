import * as React from 'react';
import classNames from 'classnames';

import './SectionHeading.scss';

export type SectionHeadingProps = {
  children?: any;
  style?: any;
  text: string;
  required?: boolean;
  id?: string;
};

const SectionHeading: React.FC<React.PropsWithChildren<SectionHeadingProps>> = ({
  text,
  children,
  style,
  required,
  id,
}) => (
  <h2 className="section-heading" style={style} data-test-section-heading={text} id={id}>
    <span
      className={classNames({
        'co-required': required,
      })}
    >
      {text}
    </span>
    {children}
  </h2>
);

export default SectionHeading;
