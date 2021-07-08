import * as React from 'react';
import Option from './Option';
import OptionGroupContext from './OptionGroupContext';
import { uniteClassNames } from '../../utils/tools';
import './style/OptionGroup.less';

export interface SelectOptionGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 样式类名 */
  className?: string;
  /** 子元素 */
  children: typeof Option | typeof Option[];
  /** 分组名称 */
  label?: React.ReactNode;
  /** 分组下所有Option是否禁止选中 */
  disabled?: boolean;
}

const classNamePrefix = `acme-select-option-group`;

export const classes = {
  root: classNamePrefix,
  label: `${classNamePrefix}-label`,
  content: `${classNamePrefix}-content`,
};

const OptionGroup: React.ForwardRefExoticComponent<
  SelectOptionGroupProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef((props: SelectOptionGroupProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { className, children, label, disabled } = props;
  return (
    <OptionGroupContext.Provider value={{ disabled }}>
      <div className={uniteClassNames(classes.root, className)} ref={ref}>
        <div className={classes.label}>{label}</div>
        <div className={classes.content}>{children}</div>
      </div>
    </OptionGroupContext.Provider>
  );
});

export default OptionGroup;
