import * as React from 'react';
import { uniteClassNames } from '../../utils/tools';
import './style/formDescription.less';

const classNamePrefix = 'acme-form-description';

export const classes = {
  root: classNamePrefix,
};

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * 样式
   */
  className?: string;
  /**
   * 子元素
   */
  children?: React.ReactNode;
}

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  (props: FormDescriptionProps, ref: React.ForwardedRef<HTMLParagraphElement>) => {
    const { className, children, ...otherProps } = props || {};
    return (
      <p className={uniteClassNames(classes.root, className)} {...otherProps} ref={ref}>
        {children}
      </p>
    );
  },
);

export default FormDescription;
