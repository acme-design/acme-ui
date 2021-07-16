import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import Select, { classes } from '../Select';
import { SelectStatus } from '../types';
import Option from '../Option';

describe('select', () => {
  mountTestSuite(
    <Select>
      <Option value="1">Option 1</Option>
      <Option value="2">Option 2</Option>
    </Select>,
  );

  // 渲染不同类型的输入框
  describe('render a select type correctly', () => {
    // 正常状态
    test('render a base select', () => {
      const { getByTestId } = render(
        <Select data-testid="acme-select-root">
          <Option value="1">Option 1</Option>
          <Option value="2">Option 2</Option>
        </Select>,
      );
      const selectRoot = getByTestId('acme-select-root');
      expect(selectRoot).toHaveClass(classes.root);
    });
    // 禁用状态
    test('render a disabled select', () => {
      const { getByTestId } = render(
        <Select data-testid="acme-select-root" disabled>
          <Option value="1">Option 1</Option>
          <Option value="2">Option 2</Option>
        </Select>,
      );
      const select = getByTestId('acme-select-selector');
      const selectInput = getByTestId('acme-select-input');
      expect(select).toHaveClass(classes.disabled);
      expect(selectInput).toBeDisabled();
    });

    // 成功状态
    test('render a success status select', () => {
      const { getByTestId } = render(
        <Select data-testid="acme-select-root" status={SelectStatus.SUCCESS}>
          <Option value="1">Option 1</Option>
          <Option value="2">Option 2</Option>
        </Select>,
      );
      const select = getByTestId('acme-select-selector');
      expect(select).toHaveClass(classes.status(SelectStatus.SUCCESS));
    });

    // 错误态
    test('render a error status select', () => {
      const { getByTestId } = render(
        <Select data-testid="acme-select-root" status={SelectStatus.ERROR}>
          <Option value="1">Option 1</Option>
          <Option value="2">Option 2</Option>
        </Select>,
      );
      const select = getByTestId('acme-select-selector');
      expect(select).toHaveClass(classes.status(SelectStatus.ERROR));
    });

    // 与父元素同宽
    test('render a fullWidth select', () => {
      const { getByTestId } = render(
        <Select data-testid="acme-select-root" fullWidth>
          <Option value="1">Option 1</Option>
          <Option value="2">Option 2</Option>
        </Select>,
      );
      const selectRoot = getByTestId('acme-select-root');
      expect(selectRoot).toHaveClass(classes.full);
    });
  });

  // 事件测试;
  describe('', () => {
    test('on default button', async () => {
      const { getByTestId } = render(
        <Select data-testid="'acme-select-root'" fullWidth>
          <Option value="1">Option 1</Option>
          <Option value="2">Option 2</Option>
        </Select>,
      );
      const select = getByTestId('acme-select-selector');
      const dropdown = getByTestId('acme-select-dropdown');
      userEvent.click(select);
      expect(dropdown).not.toHaveClass(classes.dropdownHidden);
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLDivElement>();

      render(
        <Select ref={elementRef} data-testid="acme-select-root">
          <Option value="1">Option 1</Option>
          <Option value="2">Option 2</Option>
        </Select>,
      );

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLDivElement | null = null;
      const selectRefCallback = (ref: HTMLDivElement) => {
        elementRef = ref;
      };

      render(
        <Select ref={selectRefCallback} data-testid="acme-select-root">
          <Option value="1">Option 1</Option>
          <Option value="2">Option 2</Option>
        </Select>,
      );

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLDivElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLDivElement>(null);

        return (
          <Select ref={elementRef} data-testid="acme-select-root">
            <Option value="1">Option 1</Option>
            <Option value="2">Option 2</Option>
          </Select>
        );
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
      });
    },
  });
});
