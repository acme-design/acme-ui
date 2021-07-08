import * as React from 'react';
import get from 'lodash/get';
import { createPopper, Instance } from '@popperjs/core';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';
import omit from 'lodash/omit';
import { includes } from 'lodash';
import { uniteClassNames } from '../../utils/tools';
import { ArrowSvg } from '../Icon/ArrowIcon';
import SelectContext from './SelectContext';
import { SelectSize, SelectStatus } from './types';
import Option from './Option';
import OptionGroup from './OptionGroup';
import './style/Select.less';

type SelectSizeType = `${SelectSize}`;
type SelectStatusType = `${SelectStatus}`;
type ValueType = string | number | string[] | number[];

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
  value?: ValueType;
  /**
   * 选择框的值
   */
  defaultValue?: ValueType;
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
  onChange?: (value?: ValueType) => void;
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
  onDeselect?: (val: string | number) => void;
}

const classNamePrefix = 'acme-select';

export const classes = {
  root: classNamePrefix,
  selector: `${classNamePrefix}-selector`,
  dropdown: `${classNamePrefix}-dropdown`,
  arrow: `${classNamePrefix}-arrow`,
  arrowAnimation: `${classNamePrefix}-arrow-animation`,
  selected: `${classNamePrefix}-selected`,
  selectedItem: `${classNamePrefix}-selected-item`,
  selectedItemClear: `${classNamePrefix}-selected-item-clear`,
  input: `${classNamePrefix}-input`,
  selection: `${classNamePrefix}-selection`,
  disabled: `${classNamePrefix}-disabled`,
  size: (size: SelectProps['size']) => `${classNamePrefix}-${size}`,
  status: (status: SelectProps['status']) => `${classNamePrefix}-${status}`,
  full: `${classNamePrefix}-full`,
};

const Select = React.forwardRef((props: SelectProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const {
    children,
    placeholder,
    onChange,
    defaultValue, // TODO
    value: propValue,
    multiple,
    disabled,
    size,
    status,
    fullWidth,
    onDeselect,
    visible,
    onVisibleChange,
    ...otherProps
  } = props;

  const [value, setValue] = React.useState(propValue);
  const [inputValue, setInputValue] = React.useState<React.ReactNode>(null);
  const [multipleValue, setMultipleValue] = React.useState<{ [key: string]: React.ReactNode }>({});

  let popper: Instance;
  const referenceRef: React.RefObject<HTMLInputElement> = React.createRef();
  const popperRef: React.RefObject<HTMLDivElement> = React.createRef();

  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const referenceDom = document.body;
    // const referenceDom = get(referenceRef, 'current');
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

  const handleVisible = (open: boolean) => {
    setIsOpen(open);
    if (isFunction(onVisibleChange)) onVisibleChange(open);
  };

  React.useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  React.useEffect(() => {
    document.addEventListener('click', () => {
      handleVisible(false);
    });
    return () => {
      document.removeEventListener('click', () => {
        handleVisible(false);
      });
    };
  }, []);

  const handleOptions = (val: string | number, option: React.ReactNode) => {
    if (multiple) {
      const newMultipleValue = { ...multipleValue, [val]: option };
      setMultipleValue(newMultipleValue);
    } else {
      setInputValue(option);
    }
  };

  const handleOpenDropDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e) e.stopPropagation();
    if (disabled) return;
    handleVisible(true);
  };

  const handleSelectOption = (val: string | number, option: React.ReactNode) => {
    handleOptions(val, option);
    // TODO 反选的时候option选项也要去掉
    if (isFunction(onChange)) {
      let newValue: ValueType;
      if (multiple && isArray(value)) {
        newValue = (includes(value, val) ? difference(value, [val]) : [...value, val]) as ValueType;
      } else {
        newValue = (val === value ? undefined : val) as ValueType;
      }
      onChange(newValue);
    }
    // 如果点击的是当前已选的选项，那么调用取消选中方法
    if (val === propValue || (isArray(value) && includes(value, val))) {
      if (isFunction(onDeselect)) onDeselect(val);
    }
    // 如果非多选，直接关闭下拉框
    if (!multiple) {
      handleVisible(false);
    }
  };

  // NOTICE 目前这个清除只用在多选上。
  const handleOptionClear = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    val: string | number,
  ) => {
    if (e) e.stopPropagation();
    setMultipleValue(omit(multipleValue, [val]));
    if (isFunction(onChange)) {
      const newValue = (multiple && isArray(value) ? difference(value, [val]) : val) as ValueType;
      onChange(newValue);
    }
  };

  // 反选

  const innerVisible = 'visible' in props ? visible : isOpen;

  return (
    <SelectContext.Provider
      value={{ onClick: handleSelectOption, value, multiple, onSetOptions: handleOptions }}
    >
      <div
        className={uniteClassNames(classes.root, fullWidth ? classes.full : '')}
        ref={ref}
        {...otherProps}
      >
        <div
          className={uniteClassNames(
            classes.selector,
            disabled ? classes.disabled : '',
            status ? classes.status(status) : '',
          )}
          ref={referenceRef}
          onClick={handleOpenDropDown}
        >
          <div className={classes.selection}>
            <div className={classes.selected}>
              {multiple ? (
                <>
                  {Object.keys(multipleValue).map((mValue: string | number) => (
                    <div className={classes.selectedItem}>
                      {get(multipleValue, mValue)}
                      {/** TODO 替换iconfont */}
                      <span
                        className={classes.selectedItemClear}
                        onClick={(e) => {
                          handleOptionClear(e, mValue);
                        }}
                      >
                        x
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                inputValue
              )}
            </div>
            <input
              className={uniteClassNames(classes.input, classes.size(size))}
              placeholder={inputValue || !isEmpty(multipleValue) ? '' : placeholder}
              readOnly
            />
          </div>
          <ArrowSvg
            className={uniteClassNames(classes.arrow, innerVisible ? classes.arrowAnimation : '')}
            fill={disabled ? '#ccc' : '#666'}
          />
        </div>
        {innerVisible ? (
          <div className={classes.dropdown} ref={popperRef}>
            {children}
          </div>
        ) : null}
      </div>
    </SelectContext.Provider>
  );
}) as React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLInputElement>> & {
  Option: typeof Option;
  OptionGroup: typeof OptionGroup;
};

Select.defaultProps = {
  size: 'default',
};

export default Select;
