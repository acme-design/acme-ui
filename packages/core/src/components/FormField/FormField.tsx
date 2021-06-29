import * as React from 'react';
import { uniteClassNames } from '../../utils/tools';
import FormLabel, { FormLabelProps } from '../FormLabel';
import FormDescription, { FormDescriptionProps } from '../FormDescription';
import FormHint, { FormHintProps } from '../FormHint';
import FormFieldContext from './FormFieldContext';
import { FormFieldStatus } from './types';
import './style/formField.less';

const classNamePrefix = 'acme-form-field';

export const classes = {
  root: classNamePrefix,
  label: `${classNamePrefix}-label`,
  labelWithDesc: `${classNamePrefix}-label-with-desc`,
  description: `${classNamePrefix}-description`,
  hint: `${classNamePrefix}-hint`,
};

type FormFieldStatusType = `${FormFieldStatus}`;

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 样式
   */
  className?: string;
  /**
   * 表单元素
   */
  children: React.ReactNode;
  /**
   * 表单元素的id
   */
  id?: string;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 标题
   */
  label?: FormLabelProps['children'];
  /**
   * 提供给label的htmlFor，若传了id属性则不需要传该参数
   */
  labelFor?: FormLabelProps['htmlFor'];
  /**
   * 描述
   */
  description?: FormDescriptionProps['children'];
  /**
   * 提示文案
   */
  hint?: FormHintProps['children'];
  /**
   * 提供给hint的id
   */
  hintId?: FormHintProps['id'];
  /**
   * 状态
   */
  status?: FormFieldStatusType;
  /**
   * 禁用状态
   */
  disabled?: boolean;
  /**
   * 是否撑满父元素
   */
  fullWidth?: boolean;
}

const FormField = React.forwardRef<HTMLParagraphElement, FormFieldProps>(
  (props: FormFieldProps, ref: React.ForwardedRef<HTMLParagraphElement>) => {
    const {
      className,
      children,
      id,
      required,
      status,
      disabled,
      label,
      labelFor,
      description,
      hint,
      hintId: hintIdProp,
      fullWidth,
      ...otherProps
    } = props || {};
    const labelId = label && id ? `${id}-label` : undefined;
    let hintId = hintIdProp;
    if (typeof hintIdProp === 'undefined') {
      hintId = hint && id ? `${id}-hint` : undefined;
    }
    const childContext = {
      id,
      labelId,
      hintId,
      required,
      status,
      disabled,
      fullWidth,
    };

    return (
      <FormFieldContext.Provider value={childContext}>
        <div className={uniteClassNames(classes.root, className)} {...otherProps} ref={ref}>
          {label ? (
            <FormLabel
              id={labelId}
              htmlFor={labelFor || id}
              className={uniteClassNames(classes.label, description ? classes.labelWithDesc : '')}
            >
              {label}
            </FormLabel>
          ) : null}
          {description ? (
            <FormDescription className={classes.description}>{description}</FormDescription>
          ) : null}
          {children}
          {hint ? (
            <FormHint id={hintId} className={classes.hint}>
              {hint}
            </FormHint>
          ) : null}
        </div>
      </FormFieldContext.Provider>
    );
  },
);

export default FormField;
