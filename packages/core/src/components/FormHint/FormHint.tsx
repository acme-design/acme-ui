import * as React from 'react';
import omit from 'lodash/omit';
import get from 'lodash/get';
import { FormHintStatus } from './types';
import { uniteClassNames } from '../../utils/tools';
import {
  useFormField,
  mergeFormFieldProps,
  FormFieldPropKeysType,
} from '../FormField/FormFieldContext';
import './style/formHint.less';

type FormHintStatusType = `${FormHintStatus}`;

export interface FormHintProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * 样式
   */
  className?: string;
  /**
   * 子元素
   */
  children?: React.ReactNode;
  /**
   * 状态
   */
  status?: FormHintStatusType;
  /**
   * 禁用状态
   */
  disabled?: boolean;
}

const classNamePrefix = 'acme-form-hint';

export const classes = {
  root: classNamePrefix,
  status: (status: FormHintProps['status']) => `${classNamePrefix}-${status}`,
  disabled: `${classNamePrefix}-disabled`,
};

const mergeWithContextProps: FormFieldPropKeysType = ['status', 'disabled'];

const FormHint = React.forwardRef<HTMLParagraphElement, FormHintProps>(
  (props: FormHintProps, ref: React.ForwardedRef<HTMLParagraphElement>) => {
    const { className, children, ...otherProps } = props || {};
    const formFieldContext = useFormField();
    const mergedProps = mergeFormFieldProps<FormHintProps>({
      props,
      propKeys: mergeWithContextProps,
      context: formFieldContext,
    });

    return (
      <p
        className={uniteClassNames(
          classes.root,
          mergedProps.status ? classes.status(mergedProps.status) : '',
          mergedProps.disabled ? classes.disabled : '',
          className,
        )}
        id={get(formFieldContext, 'hintId')}
        {...omit(otherProps, mergeWithContextProps)}
        ref={ref}
      >
        {children}
      </p>
    );
  },
);

export default FormHint;
