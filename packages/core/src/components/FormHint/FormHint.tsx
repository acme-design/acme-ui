import * as React from 'react';
import { FormHintStatus } from './types';
import { uniteClassNames } from '../../utils/tools';
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

const FormGroup = React.forwardRef<HTMLParagraphElement, FormHintProps>(
  (props: FormHintProps, ref: React.ForwardedRef<HTMLParagraphElement>) => {
    const { className, children, status, disabled, ...otherProps } = props || {};
    return (
      <p
        className={uniteClassNames(
          classes.root,
          status ? classes.status(status) : '',
          disabled ? classes.disabled : '',
          className,
        )}
        {...otherProps}
        ref={ref}
      >
        {children}
      </p>
    );
  },
);

export default FormGroup;
