import * as React from 'react';
import get from 'lodash/get';
import { createPopper, Instance } from '@popperjs/core';
import isFunction from 'lodash/isFunction';
import { uniteClassNames } from '../../utils/tools';
import { ArrowSvg } from '../Icon/ArrowIcon';
import SelectContext from './SelectContext';
import { SelectSize, SelectStatus } from './types';
import Option from './Option';
import './style/Select.less';

type SelectSizeType = `${SelectSize}`;
type SelectStatusType = `${SelectStatus}`;

export interface SelectProps {
  /**
   * 样式类名
   */
  className?: string;
  /**
   * 子元素
   */
  children: typeof Option | typeof Option[] | React.ReactNode; // TODO 写完Option和OptionGroup以后要替换 Option | Option[] | OptionGroup | OptionGroup[]
  /**
   * 是否多选
   */
  multiple?: boolean;
  /**
   * 选择框大小
   */
  size?: SelectSizeType;
  /**
   * 选择框的值
   */
  value?: string | string[] | number | number[];
  /**
   * 选择框的值
   */
  defaultValue?: string | string[] | number | number[];
  /**
   * 选择框占位提示
   */
  placeholder?: string;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 选择框的状态
   */
  status?: SelectStatusType;
  /**
   * 选择框值变化时的回调
   */
  onChange?: (value: string | number) => void;
  /**
   * 选择框清空时的回调
   */
  onClear?: () => void;
  /**
   * 是否与父元素同宽
   */
  fullWidth?: boolean;
  /**
   * 下拉框是否打开
   */
  visible?: boolean;
  /**
   * 下拉框变化的回调
   */
  onVisibleChange?: (visible: boolean) => void;
  /**
   * 取消选择的回调
   */
  onDeselect?: () => void;
}

const classNamePrefix = 'acme-select';

export const classes = {
  root: classNamePrefix,
  selector: `${classNamePrefix}-selector`,
  dropdown: `${classNamePrefix}-dropdown`,
  arrow: `${classNamePrefix}-arrow`,
  arrowAnimation: `${classNamePrefix}-arrow-animation`,
  selected: `${classNamePrefix}-selected`,
  input: `${classNamePrefix}-input`,
  selection: `${classNamePrefix}-selection`,
  disabled: `${classNamePrefix}-disabled`,
};

const Select = React.forwardRef((props: SelectProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { children, placeholder, onChange, value: propValue, multiple } = props;

  const [value, setValue] = React.useState(propValue);
  const [inputValue, setInputValue] = React.useState<React.ReactNode>('');

  let popper: Instance;
  const referenceRef: React.RefObject<HTMLInputElement> = React.createRef();
  const popperRef: React.RefObject<HTMLDivElement> = React.createRef();

  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const referenceDom = get(referenceRef, 'current');
    const popperDom = get(popperRef, 'current');
    if (referenceDom && popperDom) {
      popper = createPopper(referenceDom, popperDom, {
        placement: 'bottom',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 10],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              padding: {
                top: 2,
                bottom: 2,
                left: 5,
                right: 5,
              },
            },
          },
          {
            name: 'flip',
            options: {
              padding: 5,
              fallbackPlacement: ['left', 'right', 'top', 'bottom'],
            },
          },
        ],
      });
      popper.update();
    }
  }, []);

  React.useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  const onOpenDropDown = () => {
    setIsOpen(true);
  };

  const onSelectOption = (val: string, option: React.ReactNode) => {
    setInputValue(option);
    if (isFunction(onChange)) {
      onChange(val);
    }
    // 如果非多选，直接关闭下拉框
    if (!multiple) {
      setIsOpen(false);
    }
  };

  return (
    <SelectContext.Provider value={{ onClick: onSelectOption, value }}>
      <div className={uniteClassNames(classes.root)} ref={ref}>
        <div className={classes.selector} ref={referenceRef}>
          <div className={classes.selection}>
            <div className={classes.selected}>{inputValue}</div>
            <input className={classes.input} placeholder={inputValue ? '' : placeholder} readOnly />
          </div>
          <div
            className={uniteClassNames(classes.arrow, isOpen ? classes.arrowAnimation : '')}
            onClick={onOpenDropDown}
          >
            <ArrowSvg />
          </div>
        </div>
        {isOpen ? (
          <div className={classes.dropdown} ref={popperRef}>
            {children}
          </div>
        ) : null}
      </div>
    </SelectContext.Provider>
  );
}) as React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLInputElement>> & {
  Option: typeof Option;
};

export default Select;
