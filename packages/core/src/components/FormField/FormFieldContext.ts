import * as React from 'react';
import isArray from 'lodash/isArray';
import { FormFieldProps } from './FormField';

export interface FormFieldContextSchema {
  id?: string;
  labelId?: string;
  hintId?: string;
  required?: boolean;
  status?: FormFieldProps['status'];
  disabled?: boolean;
  fullWidth?: boolean;
}

const FormFieldContext = React.createContext<FormFieldContextSchema>({
  required: false,
  disabled: false,
  fullWidth: false,
});

export const useFormField = () => {
  return React.useContext(FormFieldContext);
};

type FormFieldContextKeyType = keyof FormFieldContextSchema;

export type FormFieldPropKeysType = FormFieldContextKeyType[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mergeFormFieldProps<T extends { [k: string]: any }>(params: {
  props: T;
  propKeys: FormFieldPropKeysType;
  context: FormFieldContextSchema;
}) {
  const { props, propKeys, context } = params || {};
  if (!isArray(propKeys)) return props;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return propKeys.reduce((acc: { [k: string]: any }, propName: FormFieldContextKeyType) => {
    acc[propName] = props[propName];

    if (context) {
      if (typeof props[propName] === 'undefined') {
        acc[propName] = context[propName];
      }
    }

    return acc;
  }, {});
}

export default FormFieldContext;
