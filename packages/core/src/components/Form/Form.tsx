import * as React from 'react';
import { uniteClassNames } from '../../utils/tools';
import './style/Form.less';

const classNamePrefix = 'acme-form';

export const classes = {
  root: classNamePrefix,
  inline: `${classNamePrefix}-inline`,
};

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  /**
   * 样式
   */
  className?: string;
  /**
   * 子元素
   */
  children?: React.ReactNode;
  /**
   * 垂直/水平布局
   */
  inline?: boolean;
}

const FormGroup = React.forwardRef<HTMLFormElement, FormProps>(
  (props: FormProps, ref: React.ForwardedRef<HTMLFormElement>) => {
    const { className, children, inline, ...otherProps } = props || {};
    return (
      <form
        className={uniteClassNames(classes.root, inline ? classes.inline : '', className)}
        {...otherProps}
        ref={ref}
      >
        {children}
      </form>
    );
  },
);

export default FormGroup;
