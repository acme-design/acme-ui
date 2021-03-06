import * as React from 'react';
import Button, { classNamePrefix } from './Button';
import { ButtonSize } from './types';
import './style/ButtonGroup.less';

type ButtonSizeType = `${ButtonSize}`;
export interface ButtonGroupProps {
  className?: string;
  children: typeof Button | typeof Button[];
  size?: ButtonSizeType;
}

const ButtonGroup: React.ForwardRefExoticComponent<
  ButtonGroupProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef((props: ButtonGroupProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { children, className = '', size, ...otherProps } = props;
  return (
    <div className={`${classNamePrefix}-group ${className}`} ref={ref} {...otherProps}>
      {React.Children.map(children, (child) => {
        const newChild = React.cloneElement(child as never, { size });
        return newChild;
      })}
    </div>
  );
});
ButtonGroup.defaultProps = {
  size: 'default',
};
export default ButtonGroup;
