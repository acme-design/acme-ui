import * as React from 'react';
import get from 'lodash/get';
import { createPopper, Instance } from '@popperjs/core';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';
import isBoolean from 'lodash/isBoolean';
import includes from 'lodash/includes';
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
  children: React.ReactNode;
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
  multipleSelection: `${classNamePrefix}-multiple-selection`,
  disabled: `${classNamePrefix}-disabled`,
  size: (size: SelectProps['size']) => `${classNamePrefix}-${size}`,
  status: (status: SelectProps['status']) => `${classNamePrefix}-${status}`,
  full: `${classNamePrefix}-full`,
  dropdownHidden: `${classNamePrefix}-dropdown-hidden`,
  multipleMaxHeight: (size: SelectProps['size']) => `${classNamePrefix}-selector-multiple-${size}`,
};

const popperOption = {
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
      name: 'offset',
      options: {
        offset: [0, 4],
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
};

const Select = React.forwardRef((props: SelectProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const {
    children,
    placeholder,
    onChange,
    defaultValue,
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

  const innerDefaultValue = 'value' in props ? propValue : defaultValue;
  const [value, setValue] = React.useState(innerDefaultValue);
  const [popperWidth, setPopperWidth] = React.useState(0);
  const [dropdownContent, setDropdownContent] = React.useState<Instance>();
  const [opts, setOpts] = React.useState<{ [key: string]: React.ReactNode }>({});

  const referenceRef = React.useRef() as React.RefObject<HTMLDivElement>;
  const popperRef = React.useRef() as React.RefObject<HTMLDivElement>;
  const closeRef = React.useRef() as React.RefObject<HTMLSpanElement>;

  const [isOpen, setIsOpen] = React.useState(false);

  const handleVisible = (open?: boolean) => {
    if (disabled) return;
    const newIsOpen = isBoolean(open) ? open : !isOpen;
    if (newIsOpen && dropdownContent) dropdownContent.update();
    setIsOpen(newIsOpen);
    if (isFunction(onVisibleChange)) onVisibleChange(newIsOpen);
  };

  const handleEvents = (e: Event) => {
    const referenceDom = get(referenceRef, 'current');
    const closeDom = get(closeRef, 'current');
    if (closeDom?.contains(e.target as Node)) {
      e.stopPropagation();
    } else if (referenceDom && referenceDom.contains(e.target as Node)) {
      e.stopPropagation();
    } else {
      handleVisible(false);
    }
  };

  React.useEffect(() => {
    const referenceDom = get(referenceRef, 'current');
    const popperDom = get(popperRef, 'current');
    let popper: Instance;
    if (referenceDom && popperDom) {
      popper = createPopper(referenceDom, popperDom, popperOption);
      popper.update();
      setDropdownContent(popper);
      document.addEventListener('click', handleEvents);
    }
    return () => {
      if (popper) popper.destroy();
      document.removeEventListener('click', handleEvents);
    };
  }, []);

  if ('value' in props) {
    React.useEffect(() => {
      setValue(propValue);
    }, [propValue]);
  }

  if ('visible' in props) {
    React.useEffect(() => {
      setIsOpen(!!visible);
    }, [visible]);
  }

  React.useEffect(() => {
    if (multiple) {
      if (dropdownContent) dropdownContent.update();
    }
  }, [value]);

  const handleRootWidth = () => {
    const rootWidth = get(referenceRef.current?.getBoundingClientRect(), 'width') || 0;
    setPopperWidth(rootWidth);
  };

  React.useEffect(() => {
    // TODO 最好是当窗口大小变化的时候 也是需要重新监听变化
    handleRootWidth();
  }, []);

  const handleSelectOption = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    val: string | number,
  ) => {
    if (e) e.stopPropagation();
    let newValue: ValueType;
    if (multiple && isArray(value)) {
      newValue = (includes(value, val) ? difference(value, [val]) : [...value, val]) as ValueType;
    } else {
      newValue = (val === value ? undefined : val) as ValueType;
    }
    // 如果外部没有value属性，则内部控制value展示
    if (!('value' in props)) {
      setValue(newValue);
    }
    if (isFunction(onChange)) {
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
    const newValue = (multiple && isArray(value) ? difference(value, [val]) : val) as ValueType;
    // 如果外部没有value属性，则内部控制value展示
    if (!('value' in props)) {
      setValue(newValue);
    }
    if (isFunction(onChange)) {
      onChange(newValue);
    }
  };

  const handleOpts = (val: string | number, opt: React.ReactNode) => {
    setOpts((oldOpt) => {
      return { ...oldOpt, [val]: opt };
    });
  };

  const innerVisible = 'visible' in props ? visible : isOpen;

  return (
    <SelectContext.Provider
      value={{ onSelect: handleSelectOption, value, multiple, onHandleOpts: handleOpts }}
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
            multiple ? classes.multipleMaxHeight(size) : '',
          )}
          ref={referenceRef}
          data-testid="acme-select-selector"
          onClick={() => {
            handleVisible();
          }}
        >
          <div
            className={uniteClassNames(
              classes.selection,
              multiple ? classes.multipleSelection : '',
            )}
          >
            <div className={classes.selected}>
              {isArray(value) ? (
                <>
                  {((value as string[]) || (value as number[])).map(
                    (mValue: string | number): React.ReactNode => (
                      <div className={classes.selectedItem} key={mValue}>
                        {get(opts, mValue)}
                        {/** TODO 替换iconfont */}
                        <span
                          className={classes.selectedItemClear}
                          onClick={(e) => {
                            handleOptionClear(e, mValue);
                          }}
                          ref={closeRef}
                        >
                          x
                        </span>
                      </div>
                    ),
                  )}
                </>
              ) : (
                value && get(opts, value)
              )}
            </div>
            <input
              className={uniteClassNames(classes.input, classes.size(size))}
              placeholder={value || isEmpty(value) ? '' : placeholder}
              readOnly
              disabled={disabled}
              data-testid="acme-select-input"
            />
          </div>
          <ArrowSvg
            className={uniteClassNames(classes.arrow, innerVisible ? classes.arrowAnimation : '')}
            fill={disabled ? '#ccc' : '#666'}
          />
        </div>
        <div
          className={uniteClassNames(classes.dropdown, innerVisible ? '' : classes.dropdownHidden)}
          ref={popperRef}
          style={{ width: `${popperWidth}px` }}
          data-testid="acme-select-dropdown"
        >
          {children}
        </div>
      </div>
    </SelectContext.Provider>
  );
}) as React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLDivElement>> & {
  Option: typeof Option;
  OptionGroup: typeof OptionGroup;
};

Select.defaultProps = {
  size: 'default',
};

export default Select;
