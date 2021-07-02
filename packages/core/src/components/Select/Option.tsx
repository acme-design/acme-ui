import * as React from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import { SelectSvg } from '../Icon/SelectIcon';
import SelectContext from './SelectContext';
import { uniteClassNames } from '../../utils/tools';
import './style/Option.less';

export interface SelectOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * option的值
   */
  value: string | number;
  /**
   * option内容
   */
  children: React.ReactNode;
  // /**
  //  * 点击选项的回调
  //  */
  // onClickOption?: (value: string | number) => void;
}

const classNamePrefix = `acme-select-option`;

export const classes = {
  root: classNamePrefix,
  active: `${classNamePrefix}-active`,
};

const Option: React.ForwardRefExoticComponent<
  SelectOptionProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef((props: SelectOptionProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { value: propValue, children } = props;

  const Select = React.useContext(SelectContext);

  let active = false;
  if (Select) {
    const value = get(Select, 'value');
    active = value === propValue;
  }

  const handleClick = () => {
    if (Select) {
      const onClick = get(Select, 'onClick');
      if (isFunction(onClick)) {
        onClick(propValue, children);
      }
    }
  };

  return (
    <div
      className={uniteClassNames(classes.root, active ? classes.active : '')}
      ref={ref}
      onClick={handleClick}
    >
      <div>{children}</div>
      {active ? <SelectSvg /> : <span />}
    </div>
  );
});

export default Option;
