import * as React from 'react';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import omit from 'lodash/omit';
import FormLabel, { FormLabelProps } from '../FormLabel/index';
import RadioGroup from './RadioGroup';
import RadioButton from './RadioButton';
import RadioGroupContext from './RadioGroupContext';
import {
  useFormField,
  mergeFormFieldProps,
  FormFieldPropKeysType,
} from '../FormField/FormFieldContext';
import { uniteClassNames } from '../../utils/tools';
import './style/Radio.less';

export const classNamePrefix = 'acme-radio';

export const classes = {
  root: `${classNamePrefix}-root`,
  radio: classNamePrefix,
  inline: `${classNamePrefix}-inline`,
  disabled: `${classNamePrefix}-disabled`,
};

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * style样式
   */
  style?: React.HTMLAttributes<HTMLDivElement>['style'];
  /**
   * 当前值
   */
  value?: string | number;
  /**
   * 是否选中
   */
  checked?: boolean;
  /**
   * 单选标签
   */
  label?: FormLabelProps['children'];
  /**
   * 标签位置
   */
  labelPlacement?: FormLabelProps['labelPlacement'];
  /**
   * 是否选中，非受控属性
   */
  defaultChecked?: boolean;
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 事件变化方法
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * 当前Radio是否为行内元素
   */
  inline?: boolean;
}

const mergeWithContextProps: FormFieldPropKeysType = ['id', 'disabled'];

const Radio = React.forwardRef((props: RadioProps, ref: React.ForwardedRef<HTMLInputElement>) => {
  const {
    className,
    checked,
    label,
    inline,
    defaultChecked,
    labelPlacement,
    value,
    onChange,
    name,
    style,
    ...otherProps
  } = props;

  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  if ('checked' in props) {
    React.useEffect(() => {
      setInternalChecked(checked);
    }, [checked]);
  }

  let currentChecked = internalChecked;
  let radioGroupChange: RadioProps['onChange'] | null = null;
  let internalName = name;
  const radioGroup = React.useContext(RadioGroupContext);

  const formFieldContext = useFormField();
  const mergedProps = mergeFormFieldProps<RadioProps>({
    props,
    propKeys: mergeWithContextProps,
    context: formFieldContext,
  });
  let disabled = mergedProps.disabled;

  if (radioGroup) {
    const radioGroupValue = get(radioGroup, 'value');
    if (!('checked' in props) && radioGroupValue) {
      currentChecked = radioGroupValue === value;
    }

    const radioGroupChangeFunc = get(radioGroup, 'onChange');
    if (isFunction(radioGroupChangeFunc)) {
      radioGroupChange = radioGroupChangeFunc;
    }

    const radioGroupDisabled = get(radioGroup, 'disabled');
    if (radioGroupDisabled) {
      disabled = radioGroupDisabled;
    }

    const radioGroupName = get(radioGroup, 'name');
    if (!('name' in props) && radioGroupName) {
      internalName = radioGroupName;
    }
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFunction(onChange)) {
      onChange(e);
    }
    if (isFunction(radioGroupChange)) {
      radioGroupChange(e);
    }
  };

  return (
    <FormLabel
      className={uniteClassNames(
        classes.root,
        inline ? classes.inline : '',
        disabled ? classes.disabled : '',
        className,
      )}
      style={style}
      labelPlacement={labelPlacement}
      control={
        <input
          className={classes.radio}
          id={mergedProps.id}
          aria-describedby={get(formFieldContext, 'hintId')}
          value={value}
          checked={!!currentChecked}
          disabled={!!mergedProps.disabled}
          onChange={handleRadioChange}
          name={internalName}
          ref={ref}
          {...omit(otherProps, mergeWithContextProps)}
          type="radio"
        />
      }
      data-testid="acme-radio-root"
    >
      {label}
    </FormLabel>
  );
}) as React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>> & {
  Group: typeof RadioGroup;
  Button: typeof RadioButton;
};

Radio.defaultProps = {
  labelPlacement: 'right',
};

export default Radio;
