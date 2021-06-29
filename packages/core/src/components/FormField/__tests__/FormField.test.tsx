import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { RefTestCaseType } from 'tests/shared/refTest';
import { mountTestSuite, refTestSuite } from 'tests/shared';
import FormField, { classes } from '../FormField';
import { useFormField, mergeFormFieldProps, FormFieldPropKeysType } from '../FormFieldContext';

const testId = 'test-form-field';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // eslint-disable-next-line react/no-unused-prop-types
  status?: 'error' | 'success';
}

const mergeWithContextProps: FormFieldPropKeysType = ['id', 'disabled', 'status'];

const Input: React.FC<InputProps> = (props: InputProps) => {
  const formFieldContext = useFormField();
  const mergedProps = mergeFormFieldProps<InputProps>({
    props,
    propKeys: mergeWithContextProps,
    context: formFieldContext,
  });
  return (
    <input
      id={mergedProps.id}
      disabled={mergedProps.disabled}
      aria-invalid={mergedProps.status === 'error'}
    />
  );
};

describe('FormField', () => {
  mountTestSuite(<FormField data-testid={testId}>field</FormField>);

  describe('render correctly with default props', () => {
    test('should render a default field', () => {
      const { getByTestId } = render(<FormField data-testid={testId}>default field</FormField>);
      const formField = getByTestId(testId);
      expect(formField).toHaveClass(classes.root);
    });
  });

  describe('render correctly with other props', () => {
    test('should render a error field', () => {
      const fieldId = 'test-form-field-input';
      const label = 'test-form-field-input-label';
      const { getByTestId, getByLabelText } = render(
        <FormField data-testid={testId} status="error" id={fieldId} label={label}>
          <Input />
        </FormField>,
      );
      const formField = getByTestId(testId);
      expect(formField).toHaveClass(classes.root);

      const input = getByLabelText(label);
      expect(input).toBeInTheDocument();
      expect(input).toBeInvalid();
    });

    test('should render a error field with children props', () => {
      const fieldId = 'test-form-field-input';
      const label = 'test-form-field-input-label';
      const { getByTestId, getByLabelText } = render(
        <FormField data-testid={testId} status="error" id={fieldId} label={label}>
          <Input status="success" />
        </FormField>,
      );
      const formField = getByTestId(testId);
      expect(formField).toHaveClass(classes.root);

      const input = getByLabelText(label);
      expect(input).toBeInTheDocument();
      expect(input).toBeValid();
    });

    test('should render a disabled field', () => {
      const fieldId = 'test-form-field-input';
      const label = 'test-form-field-input-label';
      const { getByTestId, getByLabelText } = render(
        <FormField data-testid={testId} disabled id={fieldId} label={label}>
          <Input />
        </FormField>,
      );

      const formField = getByTestId(testId);
      expect(formField).toHaveClass(classes.root);

      const input = getByLabelText(label);
      expect(input).toBeInTheDocument();
      expect(input).toBeDisabled();
    });

    test('should render a disabled field with children props', () => {
      const fieldId = 'test-form-field-input';
      const label = 'test-form-field-input-label';
      const { getByTestId, getByLabelText } = render(
        <FormField data-testid={testId} disabled label={label} id={fieldId}>
          <Input disabled={false} />
        </FormField>,
      );
      const formField = getByTestId(testId);
      expect(formField).toHaveClass(classes.root);

      const input = getByLabelText(label);
      expect(input).toBeInTheDocument();
      expect(input).toBeEnabled();
    });

    test('should render a field with labelFor', () => {
      const fieldId = 'test-form-field-input';
      const label = 'test-form-field-input-label';
      const { getByTestId, getByLabelText } = render(
        <FormField data-testid={testId} label={label} labelFor={fieldId}>
          <Input id={fieldId} />
        </FormField>,
      );
      const formField = getByTestId(testId);
      expect(formField).toHaveClass(classes.root);

      const input = getByLabelText(label);
      expect(input).toBeInTheDocument();
    });
  });

  refTestSuite('✨ transfer ref correctly', {
    [RefTestCaseType.createRef]: () => {
      const elementRef = React.createRef<HTMLDivElement>();

      render(
        <FormField data-testid={testId} ref={elementRef}>
          form field ref using createRef
        </FormField>,
      );

      expect(elementRef.current).toBeInTheDocument();

      expect(elementRef.current).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.callback]: () => {
      let elementRef: HTMLDivElement | null = null;
      const formFieldRefCallback = (ref: HTMLDivElement) => {
        elementRef = ref;
      };

      render(
        <FormField data-testid={testId} ref={formFieldRefCallback}>
          form field ref with using callback
        </FormField>,
      );

      expect(elementRef).toBeInTheDocument();

      expect(elementRef).toEqual(expect.any(HTMLDivElement));
    },
    [RefTestCaseType.useRef]: async () => {
      let elementRef: React.RefObject<HTMLDivElement>;
      const Test = () => {
        elementRef = React.useRef<HTMLDivElement>(null);

        return (
          <FormField data-testid={testId} ref={elementRef}>
            form field ref using useRef
          </FormField>
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
