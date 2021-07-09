import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import Form, { classes } from '../Form';

const testId = 'test-form';

describe('Form', () => {
  mountTestSuite(<Form data-testid={testId}>label</Form>);

  describe('render a form placement correctly', () => {
    test('should render a vertical form', () => {
      const { getByTestId } = render(<Form data-testid={testId}>default form</Form>);
      const form = getByTestId(testId);
      expect(form).toHaveClass(classes.root);
    });

    test('should render an inline form', () => {
      const { getByTestId } = render(
        <Form data-testid={testId} inline>
          inline form
        </Form>,
      );

      const form = getByTestId(testId);
      expect(form).toHaveClass(classes.root);
      expect(form).toHaveClass(classes.inline);
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLFormElement>();

      render(
        <Form data-testid={testId} ref={elementRef}>
          form ref using createRef
        </Form>,
      );

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLFormElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLFormElement | null = null;
      const labelRefCallback = (ref: HTMLFormElement) => {
        elementRef = ref;
      };

      render(
        <Form data-testid={testId} ref={labelRefCallback}>
          form ref with using callback
        </Form>,
      );

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLFormElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLFormElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLFormElement>(null);

        return (
          <Form data-testid={testId} ref={elementRef}>
            form ref using useRef
          </Form>
        );
      };

      await waitFor(() => {
        render(<Test />);

        expect(elementRef.current).toBeInTheDocument();

        expect(elementRef.current).toEqual(expect.any(HTMLFormElement));
      });
    },
  });
});
