import * as React from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import includes from 'lodash/includes';
import { SelectSvg } from '../Icon/SelectIcon';
import SelectContext from './SelectContext';
import OptionGroupContext from './OptionGroupContext';
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
  /**
   * 选项是否被禁用
   */
  disabled?: boolean;
}

const classNamePrefix = `acme-select-option`;

export const classes = {
  root: classNamePrefix,
  active: `${classNamePrefix}-active`,
  disabled: `${classNamePrefix}-disabled`,
};

const Option: React.ForwardRefExoticComponent<
  SelectOptionProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef((props: SelectOptionProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { value: propValue, children, disabled: propDisabled } = props;

  const selectContextInstance = React.useContext(SelectContext);
  const optionGroupContextInstance = React.useContext(OptionGroupContext);

  let disabled = !!propDisabled;

  let active = false;
  if (selectContextInstance) {
    const value = get(selectContextInstance, 'value');
    active = isArray(value) ? includes(value, propValue) : value === propValue;
  }

  if (optionGroupContextInstance && !('disabled' in props)) {
    disabled = get(optionGroupContextInstance, 'disabled');
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) return;
    if (selectContextInstance) {
      const onSelect = get(selectContextInstance, 'onSelect');
      if (isFunction(onSelect)) {
        onSelect(e, propValue);
      }
    }
  };

  return (
    <div
      className={uniteClassNames(
        classes.root,
        active ? classes.active : '',
        disabled ? classes.disabled : '',
      )}
      ref={ref}
      onClick={handleClick}
    >
      <div>{children}</div>
      {active ? <SelectSvg /> : <span />}
    </div>
  );
});

export default Option;
