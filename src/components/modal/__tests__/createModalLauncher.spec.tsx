import * as React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import {
  ComponentProps,
  createRawModalLauncher,
  createModalLauncher,
} from '../createModalLauncher';

describe('createModalLauncher', () => {
  it('should create a raw modal launcher', () => {
    let props: any = undefined;
    const Modal = (p: { text: string } & ComponentProps) => {
      props = p;
      return <div>{p.text}</div>;
    };
    const onCloseCP = jest.fn();
    const launcher = createRawModalLauncher(Modal, {
      'data-testid': 'test',
      onClose: onCloseCP,
    });
    const onClose = jest.fn();
    const result = render(launcher({ text: 'test' })(onClose));
    expect(result.container).toHaveTextContent('test');

    expect(props.modalProps.isOpen).toBe(true);
    expect(props.modalProps['data-testid']).toBe('test');
    props.onClose();
    expect(onClose).toHaveBeenCalled();
    expect(onCloseCP).toBeCalled();
  });

  it('should create a modal launcher', () => {
    let props: any = undefined;
    const Modal = (p: { text: string } & ComponentProps) => {
      props = p;
      return <div>{p.text}</div>;
    };
    const onCloseCP = jest.fn();
    const launcher = createModalLauncher(Modal, {
      'data-testid': 'test',
      onClose: onCloseCP,
    });
    const onClose = jest.fn();
    const result = render(launcher({ text: 'test' })(onClose), {
      wrapper: ({ children }) => (
        <div>
          <div id="hacDev-modal-container" />
          <div>{children}</div>
        </div>
      ),
    });

    expect(result.container).toHaveTextContent('test');
    expect(result.queryByRole('dialog')).toBeInTheDocument();

    props.onClose('foo');
    expect(onClose).toHaveBeenCalled();
    expect(onCloseCP).toBeCalled();
  });
});
