import * as React from 'react';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';
import set from 'lodash/set';
import {
  useFormField,
  mergeFormFieldProps,
  FormFieldPropKeysType,
} from '../FormField/FormFieldContext';
import { uniteClassNames } from '../../utils/tools';
import { PrimaryLoadingSvg } from '../Icon/LoadingIcon';

import './style/switch.less';

const classNamePrefix = 'acme-switch';

export const classes = {
  root: classNamePrefix,
  size: (size: SwitchProps['size']): string => `${classNamePrefix}-${size}`,
  input: `${classNamePrefix}-input`,
  content: `${classNamePrefix}-content`,
  btn: `${classNamePrefix}-btn`,
  disabled: `${classNamePrefix}-disabled`,
  loading: `${classNamePrefix}-loading`,
};

export enum SwitchSize {
  DEFAULT = 'default',
  SMALL = 'small',
}

type SwitchSizeType = `${SwitchSize}`;

export interface SwitchProps extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> {
  /**
   * Switch 样式
   */
  className?: string;
  /**
   * Switch 大小
   */
  size?: SwitchSizeType;
  /**
   * 当前是否选中
   */
  checked?: boolean;
  /**
   * 默认选中状态
   */
  defaultChecked?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 真实的input元素
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * 是否处于加载状态
   */
  loading?: boolean;
  /**
   * 状态切换事件
   * @param event
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const mergeWithContextProps: FormFieldPropKeysType = ['id', 'disabled'];

const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(
  (props: SwitchProps, ref: React.ForwardedRef<HTMLLabelElement>): React.ReactElement => {
    const { className, size, inputRef, onChange, loading, defaultChecked, checked, ...otherProps } =
      props || {};
    const formFieldContext = useFormField();
    const mergedProps = mergeFormFieldProps<SwitchProps>({
      props,
      propKeys: mergeWithContextProps,
      context: formFieldContext,
    });
    const inputCheckedProps = {
      defaultChecked,
    };
    if ('checked' in props) {
      set(inputCheckedProps, 'checked', !!checked);
      delete inputCheckedProps.defaultChecked;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isFunction(onChange)) {
        onChange(e);
      } else {
        console.warn('switch props onChange is not a function');
      }
    };

    const internalDisabled = mergedProps.disabled || loading;

    return (
      <label
        className={uniteClassNames(
          classes.root,
          classes.size(size),
          internalDisabled ? classes.disabled : '',
          className,
        )}
        {...omit(otherProps, mergeWithContextProps)}
        ref={ref}
      >
        <input
          className={classes.input}
          id={mergedProps.id}
          {...inputCheckedProps}
          type="checkbox"
          ref={inputRef}
          onChange={handleInputChange}
          disabled={internalDisabled}
        />
        <span className={classes.content}>
          <span className={classes.btn}>
            {loading ? <PrimaryLoadingSvg className={classes.loading} /> : null}
          </span>
        </span>
      </label>
    );
  },
);

Switch.defaultProps = {
  size: SwitchSize.DEFAULT,
};

export default Switch;
