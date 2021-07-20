import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { mountTestSuite } from 'tests/shared';
import SearchInput, { classes } from '../SearchInput';

describe('SearchInput', () => {
  mountTestSuite(<SearchInput />);

  describe('render search input', () => {
    const { getByTestId } = render(<SearchInput />);
    const inputRoot = getByTestId('acme-input-root');
    expect(inputRoot).toHaveClass(classes.root);
  });

  describe('listen event', () => {
    test('click', () => {
      const mockFn = jest.fn();
      const { getByTestId } = render(
        <SearchInput data-testid="acme-search-input" onSearch={mockFn} />,
      );
      const searchInputIcon = getByTestId(classes.searchIcon);
      userEvent.click(searchInputIcon);

      expect(mockFn).toBeCalledTimes(1);
    });
    test('keyboard', () => {
      const mockFn = jest.fn();
      const { getByTestId } = render(
        <SearchInput data-testid="acme-search-input" onSearch={mockFn} />,
      );
      const searchInput = getByTestId('acme-search-input');
      searchInput.focus();
      fireEvent.keyDown(searchInput, { key: 'Enter', code: 13 });

      setTimeout(() => {
        expect(mockFn).toBeCalledTimes(1);
      }, 0);
    });
  });
});
