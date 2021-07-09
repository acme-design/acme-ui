import * as React from 'react';
import get from 'lodash/get';
import { createPopper, Instance } from '@popperjs/core';
import isFunction from 'lodash/isFunction';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';
// import omit from 'lodash/omit';
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
  dropdownHidden: `${classNamePrefix}-dropdown-hidden`,
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
  // const [multipleValue, setMultipleValue] = React.useState<{
  //   [key: string | number]: React.ReactNode;
  // }>({});

  const [options, setOptions] = React.useState<{ [key: string]: React.ReactNode }>({});

  let popper: Instance;
  const referenceRef: React.RefObject<HTMLInputElement> = React.createRef();
  const popperRef: React.RefObject<HTMLDivElement> = React.createRef();

  const [isOpen, setIsOpen] = React.useState(false);

  const handleVisible = (open: boolean) => {
    if (popper && open) popper.update();
    setIsOpen(open);
    if (isFunction(onVisibleChange)) onVisibleChange(open);
  };

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
      });
      popper.update();
      referenceDom.addEventListener('click', (e: Event) => {
        if (e) e.stopPropagation();
        handleVisible(true);
      });
    }
    return () => {
      if (popper) popper.destroy();
      if (referenceDom) {
        referenceDom.removeEventListener('click', (e: Event) => {
          if (e) e.stopPropagation();
          handleVisible(true);
        });
      }
    };
  }, []);

  if ('value' in props) {
    React.useEffect(() => {
      setValue(propValue);
    }, [propValue]);
  }

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

  const handleAllOptions = () => {
    let currentOptions = {};
    React.Children.map(children, (c: unknown) => {
      const { value: v, children: ch } = get(c, 'props');
      currentOptions = { ...currentOptions, [v]: ch };
    });
    setOptions(currentOptions);
  };

  React.useEffect(() => {
    handleAllOptions();
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
    // setMultipleValue(omit(multipleValue, [val]));
    const newValue = (multiple && isArray(value) ? difference(value, [val]) : val) as ValueType;
    // 如果外部没有value属性，则内部控制value展示
    if (!('value' in props)) {
      setValue(newValue);
    }
    if (isFunction(onChange)) {
      onChange(newValue);
    }
  };

  const innerVisible = 'visible' in props ? visible : isOpen;

  return (
    <SelectContext.Provider value={{ onClick: handleSelectOption, value, multiple }}>
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
        >
          <div className={classes.selection}>
            <div className={classes.selected}>
              {isArray(value) ? (
                <>
                  {/* TODO 这个地方类型应该还有number[] */}
                  {(value as string[]).map(
                    (mValue: string | number): React.ReactNode => (
                      <div className={classes.selectedItem}>
                        {get(options, mValue)}
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
                    ),
                  )}
                </>
              ) : (
                value && get(options, value)
              )}
            </div>
            <input
              className={uniteClassNames(classes.input, classes.size(size))}
              placeholder={value || isEmpty(value) ? '' : placeholder}
              readOnly
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
          style={{ width: get(props, 'style.width') }}
        >
          {children}
        </div>
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
