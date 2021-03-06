import * as React from 'react';
import isFunction from 'lodash/isFunction';
import FormGroup, { FormGroupProps } from '../FormGroup';
import Radio from './Radio';
import RadioGroupContext from './RadioGroupContext';
import { uniteClassNames } from '../../utils/tools';
import { RadioSize } from './types';
import './style/RadioGroup.less';

type RadioSizeType = `${RadioSize}`;

export interface RadioGroupProps {
  /**
   * 样式类名
   */
  className?: string;
  /**
   * 子元素
   */
  children?: typeof Radio | typeof Radio[];
  /**
   * 当前选中的值
   */
  value?: string | number;
  /**
   * 按钮组的布局方式
   */
  layout?: FormGroupProps['layout'];
  /**
   * 禁用状态
   */
  disabled?: boolean;
  /**
   * 同input的name属性
   */
  name?: string;
  /**
   * Radio.Button按钮大小
   */
  size?: RadioSizeType;
  /**
   * 选项变化的回调函数
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const classNamePrefix = 'acme-radio-group';

export const classes = {
  root: classNamePrefix,
};

const RadioGroup: React.ForwardRefExoticComponent<
  RadioGroupProps & React.RefAttributes<HTMLDivElement>
> = React.forwardRef((props: RadioGroupProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { className, children, value, layout, disabled, name, size, onChange, ...otherProps } =
    props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFunction(onChange)) {
      onChange(e);
    }
  };

  return (
    <RadioGroupContext.Provider value={{ value, name, disabled, onChange: handleChange, size }}>
      <FormGroup
        className={uniteClassNames(classes.root, className)}
        ref={ref}
        layout={layout}
        {...otherProps}
      >
        {children}
      </FormGroup>
    </RadioGroupContext.Provider>
  );
});

RadioGroup.defaultProps = {
  layout: 'vertical',
};

export default RadioGroup;
