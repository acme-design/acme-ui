import * as React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import indexOf from 'lodash/indexOf';
import omit from 'lodash/omit';
import { uniteClassNames } from '../../utils/tools';
import FormLabel, { FormLabelProps } from '../FormLabel';
import {
  useFormField,
  mergeFormFieldProps,
  FormFieldPropKeysType,
} from '../FormField/FormFieldContext';
import CheckboxGroup, { CheckGroupContext } from './CheckboxGroup';
import './style/Checkbox.less';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 最外层元素样式
   */
  className?: string;
  /**
   * label内容
   */
  children?: FormLabelProps['children'];
  /**
   * 是否选中
   */
  checked?: boolean;
  /**
   * 初始是否选中
   */
  defaultChecked?: boolean;
  /**
   * 半选状态，只控制样式
   */
  indeterminate?: boolean;
  /**
   * checkbox 值
   */
  value?: string | number;
  /**
   * checkbox 状态改变
   */
  onChange?: (e: React.ChangeEvent) => void;
  /**
   * 是否必填
   */
  required?: FormLabelProps['required'];
  /**
   * 禁用状态
   */
  disabled?: boolean;
  /**
   * 标签所在位置
   */
  labelPlacement?: FormLabelProps['labelPlacement'];
}

export const classNamePrefix = 'acme-checkbox';

export const classes = {
  root: classNamePrefix,
  indeterminate: `${classNamePrefix}-indeterminate`,
  input: `${classNamePrefix}-input`,
  default: `${classNamePrefix}-default`,
  disabled: `${classNamePrefix}-disabled`,
  content: `${classNamePrefix}-content`,
};

const mergeWithContextProps: FormFieldPropKeysType = ['id', 'disabled', 'required'];

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props: CheckboxProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {
      className,
      children,
      defaultChecked,
      checked,
      indeterminate,
      value,
      onChange,
      name,
      labelPlacement,
      style,
      ...otherProps
    } = props;

    const checkboxGroup = React.useContext(CheckGroupContext);

    const [currChecked, setCurrChecked] = React.useState(defaultChecked);
    React.useEffect(() => {
      if ('checked' in props) {
        setCurrChecked(checked);
      }
    }, [checked]);

    const formFieldContext = useFormField();
    const mergedProps = mergeFormFieldProps<CheckboxProps>({
      props,
      propKeys: mergeWithContextProps,
      context: formFieldContext,
    });
    const inputProps = {
      ...omit(otherProps, mergeWithContextProps),
      checked: !!currChecked,
      disabled: !!mergedProps.disabled,
      name,
    };
    if (checkboxGroup) {
      set(inputProps, 'checked', indexOf(get(checkboxGroup, 'values'), value) > -1);
      const checkboxGroupDisabled = get(checkboxGroup, 'disabled');
      if (checkboxGroupDisabled) {
        set(inputProps, 'disabled', !!checkboxGroupDisabled);
      }
      set(inputProps, 'name', get(checkboxGroup, 'name'));
    }

    const groupChange = get(checkboxGroup, 'onChange');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = get(e, 'target.checked');
      if (checked === undefined) {
        setCurrChecked(isChecked);
      }
      if (isFunction(onChange)) {
        onChange(e);
      }
      if (isFunction(groupChange)) {
        checkboxGroup?.onChange(value as string);
      }
    };

    return (
      <FormLabel
        className={uniteClassNames(
          classes.root,
          mergedProps.disabled ? classes.disabled : '',
          className,
        )}
        labelPlacement={labelPlacement}
        style={style}
        required={mergedProps.required}
        control={
          <span className={classes.content}>
            <input
              className={classes.input}
              id={mergedProps.id}
              aria-describedby={get(formFieldContext, 'hintId')}
              {...inputProps}
              value={value}
              onChange={handleInputChange}
              ref={ref}
              type="checkbox"
            />
            <span
              className={uniteClassNames(
                classes.default,
                indeterminate ? classes.indeterminate : '',
              )}
            />
          </span>
        }
        data-testid="acme-checkbox-root"
      >
        {children}
      </FormLabel>
    );
  },
) as React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>> & {
  Group: typeof CheckboxGroup;
};

export default Checkbox;
