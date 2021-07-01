import React from 'react';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import { render, waitFor } from '@testing-library/react';
import Alert, { classes } from '../Alert';
import { RefTestCaseType } from '../../../../tests/shared/refTest';

const testId = 'alert-test-id';

describe('alert', () => {
  mountTestSuite(<Alert>测试提示文案</Alert>);

  describe('render a alert correctly', () => {
    test('render default alert', () => {
      const { getByTestId } = render(<Alert data-testid={testId}>默认提示文案</Alert>);
      const alert = getByTestId(testId);
      expect(alert).not.toBeNull();
      expect(alert).toHaveClass(classes.root);
      expect(alert).toHaveTextContent('默认提示文案');
    });
    test('render success alert', () => {
      const type = 'success';
      const { getByTestId } = render(
        <Alert type={type} data-testid={testId}>
          成功提示文案
        </Alert>,
      );
      const alert = getByTestId(testId);
      expect(alert).not.toBeNull();
      expect(alert).toHaveClass(classes.appearance(type));
      expect(alert).toHaveTextContent('成功提示文案');
    });
    test('render close alert', () => {
      const { getByTestId } = render(
        <Alert closable data-testid={testId}>
          消息提示文案
        </Alert>,
      );
      const alert = getByTestId(testId);
      expect(alert).not.toBeNull();
      expect(alert.getElementsByClassName(classes.closeWrap).length).not.toEqual(0);
      expect(alert).toHaveTextContent('消息提示文案');
    });
    test('render icon alert', () => {
      const { getByTestId } = render(
        <Alert showIcon data-testid={testId}>
          消息提示文案
        </Alert>,
      );
      const alert = getByTestId(testId);
      expect(alert).not.toBeNull();
      expect(alert.getElementsByClassName(classes.iconWrap).length).not.toEqual(0);
      expect(alert).toHaveTextContent('消息提示文案');
    });

    test('render self icon alert', () => {
      const selfIcon = <span id="selfIcon">icon</span>;
      const { getByTestId } = render(
        <Alert icon={selfIcon} data-testid={testId}>
          消息提示文案
        </Alert>,
      );
      const alert = getByTestId(testId);
      expect(alert.firstChild).not.toBeNull();
      expect(alert.firstChild).toContainElement(document.getElementById('selfIcon'));
      expect(alert).toHaveTextContent('消息提示文案');
    });
  });

  refTestSuite('test ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLDivElement>();

      render(<Alert ref={elementRef}>alert</Alert>);

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLDivElement | null = null;
      const CheckboxRefCallback = (ref: HTMLDivElement) => {
        elementRef = ref;
      };

      render(<Alert ref={CheckboxRefCallback}>alert</Alert>);

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLDivElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLDivElement>(null);

        return <Alert ref={elementRef}>alertRef using useRef</Alert>;
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
      });
    },
  });
});
