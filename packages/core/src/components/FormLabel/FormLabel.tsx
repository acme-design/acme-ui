import * as React from 'react';
import omit from 'lodash/omit';
import get from 'lodash/get';
import { uniteClassNames } from '../../utils/tools';
import { FormLabelPlacement, FormLabelStatus } from './types';
import {
  useFormField,
  mergeFormFieldProps,
  FormFieldPropKeysType,
} from '../FormField/FormFieldContext';
import './style/formLabel.less';

const classNamePrefix = 'acme-form-label';

export const classes = {
  root: classNamePrefix,
  placement: (placement: FormLabelProps['labelPlacement']): string =>
    `${classNamePrefix}-${placement}`,
  status: (status: FormLabelProps['status']) => `${classNamePrefix}-${status}`,
  control: `${classNamePrefix}-control`,
  content: `${classNamePrefix}-content`,
  required: `${classNamePrefix}-required`,
};

type FormLabelPlacementType = `${FormLabelPlacement}`;
type FormLabelStatusType = `${FormLabelStatus}`;

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * 样式
   */
  className?: string;
  /**
   * label内容
   */
  children?: React.ReactNode;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 状态
   */
  status?: FormLabelStatusType;
  /**
   * 所在位置，配合control有效果
   */
  labelPlacement?: FormLabelPlacementType;
  /**
   * 控件元素
   */
  control?: React.ReactElement;
}

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  (props: FormLabelProps, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const { className, children, control, labelPlacement, ...otherProps } = props || {};
    const mergeWithContextProps: FormFieldPropKeysType = control ? [] : ['required', 'status'];

    const formFieldContext = useFormField();
    const mergedProps = mergeFormFieldProps<FormLabelProps>({
      props,
      propKeys: mergeWithContextProps,
      context: formFieldContext,
    });

    return (
      <label
        className={uniteClassNames(
          classes.root,
          classes.placement(labelPlacement),
          mergedProps.status ? classes.status(mergedProps.status) : '',
          className,
        )}
        id={get(formFieldContext, 'labelId')}
        {...omit(otherProps, mergeWithContextProps)}
        ref={ref}
      >
        {control ? <div className={classes.control}>{control}</div> : null}
        <span className={classes.content}>
          {children}
          {mergedProps.required ? (
            <span aria-hidden className={classes.required}>
              *
            </span>
          ) : null}
        </span>
      </label>
    );
  },
);

FormLabel.defaultProps = {
  labelPlacement: FormLabelPlacement.RIGHT,
};

export default FormLabel;
