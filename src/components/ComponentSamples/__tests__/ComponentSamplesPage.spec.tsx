import * as React from 'react';
import { configure, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockCatalogItem } from '../../../utils/__data__/mock-devfile-data';
import { getDevfileSamples } from '../../../utils/devfile-utils';
import { ComponentSamplesPage } from '../ComponentSamplesPage';

configure({ testIdAttribute: 'data-test' });

jest.mock('../../Wizard/Wizard', () => ({
  useWizardContext: jest.fn(() => ({
    handleNext: jest.fn(),
    handleBack: jest.fn(),
    handleReset: jest.fn(),
  })),
}));

jest.mock('../../form-context', () => ({
  useFormValues: jest.fn(() => [{} as any, jest.fn()]),
}));

jest.mock('../../../utils/devfile-utils', () => ({
  getDevfileSamples: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: (props) => <a href={props.to}>{props.children}</a>,
  useLocation: jest.fn(() => ({
    search: '',
  })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (x) => x })),
}));

jest.mock('../../../shared/hooks/useScrollShadows', () => ({
  useScrollShadows: jest.fn().mockReturnValue('none'),
  Shadows: () => null,
}));

const getDevfileMock = getDevfileSamples as jest.Mock;

describe('ComponentSamplesPage', () => {
  it('renders component samples page with a footer', async () => {
    getDevfileMock.mockReturnValue(Promise.resolve([]));
    render(<ComponentSamplesPage />);
    await screen.findByTestId('form-footer');
  });

  it('renders component samples page with empty catalog message', async () => {
    getDevfileMock.mockReturnValue(Promise.resolve([]));
    render(<ComponentSamplesPage />);
    await screen.findByText('Start with a sample');
    await screen.findByText('No Catalog items found');
  });

  it('renders component samples page with 4 items', async () => {
    getDevfileMock.mockReturnValue(Promise.resolve(mockCatalogItem));
    render(<ComponentSamplesPage />);
    await screen.findByText('4 items');
    await screen.findByTestId('search-catalog');
  });

  it('filters samples with provided keyword', async () => {
    getDevfileMock.mockReturnValue(Promise.resolve(mockCatalogItem));
    render(<ComponentSamplesPage />);
    await screen.findByTestId('search-catalog');
    await screen.findByText('4 items');
    fireEvent.change(await screen.findByPlaceholderText('Filter by keyword...'), {
      target: { value: 'node' },
    });
    await screen.findByText('1 item');
  });
});
