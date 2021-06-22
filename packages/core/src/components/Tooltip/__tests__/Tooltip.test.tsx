import * as React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { RefTestCaseType } from 'tests/shared/refTest';
import userEvent from '@testing-library/user-event';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import Tooltip, { classes } from '../Tooltip';

const tooltipTestId = 'acme-tooltip-test-id';

describe('Tooltip', () => {
  mountTestSuite(<Tooltip content="提示文字">工具提示</Tooltip>);

  // 正确渲染工具提示
  describe('render a tooltip', () => {
    test('render a base tooltip correctly', () => {
      const { getByTestId } = render(
        <Tooltip content="surprise" data-testid={tooltipTestId}>
          Hover有惊喜
        </Tooltip>,
      );
      const tooltip = getByTestId(tooltipTestId);
      const tooltipPopper = getByTestId('acme-popper');
      expect(tooltip).toHaveClass(classes.root);
      expect(tooltipPopper).toHaveClass(classes.popper);
    });

    test('render a tooltip content correctly', () => {
      const { getByTestId } = render(
        <Tooltip
          content={<div data-testid="acme-tooltip-content">这里是提示</div>}
          data-testid={tooltipTestId}
        >
          工具提示
        </Tooltip>,
      );
      const tooltip = getByTestId(tooltipTestId);
      const tooltipPopperContent = getByTestId('acme-tooltip-content');
      expect(tooltip).toHaveClass(classes.root);
      expect(tooltipPopperContent).toBeInTheDocument();
    });
  });

  // 不同事件相应
  describe('test trigger event', () => {
    test('click', () => {
      const { getByTestId } = render(
        <Tooltip content="这里是提示" trigger="click" openDelay={0}>
          <div data-testid="acme-tooltip-reference">提示工具</div>
        </Tooltip>,
      );
      const popperContent = getByTestId('acme-popper');
      const reference = getByTestId('acme-tooltip-reference');

      userEvent.click(reference);
      expect(popperContent).toBeVisible();
    });

    test('hover', () => {
      const { getByTestId } = render(
        <Tooltip content="这里是提示">
          <div data-testid="acme-tooltip-reference">提示工具</div>
        </Tooltip>,
      );
      const popperContent = getByTestId('acme-popper');
      const reference = getByTestId('acme-tooltip-reference');

      userEvent.hover(reference);
      setTimeout(() => {
        expect(popperContent).toBeVisible();
      }, 100);
      userEvent.unhover(reference);
      expect(popperContent).not.toBeVisible();
    });

    test('focus', () => {
      const { getByTestId } = render(
        <Tooltip content="这里是提示" trigger="focus">
          <div data-testid="acme-tooltip-reference">提示工具</div>
        </Tooltip>,
      );
      const popperContent = getByTestId('acme-popper');
      const reference = getByTestId('acme-tooltip-reference');
      fireEvent.focusIn(reference);
      setTimeout(() => {
        expect(popperContent).toBeVisible();
      }, 100);
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLDivElement>();

      render(
        <Tooltip content="这里是提示文字" ref={elementRef}>
          工具提示
        </Tooltip>,
      );

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLDivElement | null = null;
      const buttonRefCallback = (ref: HTMLDivElement) => {
        elementRef = ref;
      };

      render(
        <Tooltip content="这里是提示文字" ref={buttonRefCallback}>
          工具提示
        </Tooltip>,
      );

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLDivElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLDivElement>(null);

        return (
          <Tooltip content="这里是提示文字" ref={elementRef}>
            工具提示
          </Tooltip>
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
