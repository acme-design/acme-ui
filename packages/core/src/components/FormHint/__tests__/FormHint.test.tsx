import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import FormHint, { classes } from '../FormHint';
import { FormHintStatus } from '../types';

const testId = 'test-form-hint';

describe('FormHint', () => {
  mountTestSuite(<FormHint data-testid={testId}>hint</FormHint>);

  describe('render correctly with default props', () => {
    test('should render a default hint', () => {
      const { getByTestId } = render(<FormHint data-testid={testId}>default hint</FormHint>);
      const hint = getByTestId(testId);
      expect(hint).toHaveClass(classes.root);
    });
  });

  describe('render correctly with other props', () => {
    test('should render a error hint', () => {
      const { getByTestId } = render(
        <FormHint data-testid={testId} status={FormHintStatus.ERROR}>
          error hint
        </FormHint>,
      );
      const hint = getByTestId(testId);
      expect(hint).toHaveClass(classes.root);
      expect(hint).toHaveClass(classes.status(FormHintStatus.ERROR));
    });

    test('should render a success hint', () => {
      const { getByTestId } = render(
        <FormHint data-testid={testId} status={FormHintStatus.SUCCESS}>
          success hint
        </FormHint>,
      );
      const hint = getByTestId(testId);
      expect(hint).toHaveClass(classes.root);
      expect(hint).toHaveClass(classes.status(FormHintStatus.SUCCESS));
    });

    test('should render a warning hint', () => {
      const { getByTestId } = render(
        <FormHint data-testid={testId} status={FormHintStatus.WARNING}>
          warning hint
        </FormHint>,
      );
      const hint = getByTestId(testId);
      expect(hint).toHaveClass(classes.root);
      expect(hint).toHaveClass(classes.status(FormHintStatus.WARNING));
    });

    test('should render a disabled hint', () => {
      const { getByTestId } = render(
        <FormHint data-testid={testId} disabled>
          disabled hint
        </FormHint>,
      );
      const hint = getByTestId(testId);
      expect(hint).toHaveClass(classes.root);
      expect(hint).toHaveClass(classes.disabled);
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLParagraphElement>();

      render(
        <FormHint data-testid={testId} ref={elementRef}>
          form hint ref using createRef
        </FormHint>,
      );

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLParagraphElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLParagraphElement | null = null;
      const hintRefCallback = (ref: HTMLParagraphElement) => {
        elementRef = ref;
      };

      render(
        <FormHint data-testid={testId} ref={hintRefCallback}>
          form hint ref with using callback
        </FormHint>,
      );

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLParagraphElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLParagraphElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLParagraphElement>(null);

        return (
          <FormHint data-testid={testId} ref={elementRef}>
            form hint ref using useRef
          </FormHint>
        );
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLParagraphElement));
      });
    },
  });
});
