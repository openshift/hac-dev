import React from 'react';
import SampleComponent from './SampleComponent';

describe('SampleComponent', () => {
  it('expect sample-component to render children', () => {
    const children = '<h1>Hello</h1>';

    const wrapper = shallow(<SampleComponent>{children}</SampleComponent>);
    expect(wrapper.prop('children')).toContain(children);
  });
});
