import * as React from 'react';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';
import { PrimaryLoadingSvg } from '../Icon/LoadingIcon';
import { SuccessSvg } from '../Icon/SuccessIcon';
import { PasswordOpenEyeSvg, PasswordCloseEyeSvg } from '../Icon/PasswordEyeIcon';
import { ClearSvg } from '../Icon/ClearIcon';
import {
  useFormField,
  mergeFormFieldProps,
  FormFieldPropKeysType,
} from '../FormField/FormFieldContext';
import { uniteClassNames } from '../../utils/tools';
import { InputMode, InputSize, InputStatus } from './types';
import './styles/Input.less';

type InputModeType = `${InputMode}`;
type InputSizeType = `${InputSize}`;
type InputStatusType = `${InputStatus}`;

/** TODO 数字类型的input 待设计给出详细设计和样式 */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * 样式类名
   */
  className?: string;
  /**
   * input 类型 TODO 暂时没有样式变化
   */
  mode?: InputModeType;
  /**
   * 输入框大小
   */
  size?: InputSizeType;
  /**
   * 输入框值
   */
  value?: React.InputHTMLAttributes<HTMLInputElement>['value'];
  /**
   * 输入框默认值 非受控
   */
  defaultValue?: React.InputHTMLAttributes<HTMLInputElement>['defaultValue'];
  /**
   * 输入框内容提示
   */
  placeholder?: string;
  /**
   * 禁用状态
   */
  disabled?: boolean;
  /**
   * 状态
   */
  status?: InputStatusType;
  /**
   * 是否撑满父元素
   */
  fullWidth?: boolean;
  /**
   * input内部最前面的元素
   */
  startElement?: React.ReactNode;
  /**
   * input内部最后面的元素
   */
  endElement?: React.ReactNode;
  /**
   * 输入框内容变化时的回调
   */
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * 输入框清空的回调
   */
  onClear?: () => void;
  /**
   * 输入框字数限制
   */
  limit?: number;
  /**
   * 是否展示清空按钮
   */
  clear?: boolean;
  /**
   * 输入框获得焦点的回调
   */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * 输入框失去焦点的回调
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * 输入框类型
   */
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  /**
   * 输入框最外层样式
   */
  style?: React.HtmlHTMLAttributes<HTMLDivElement>['style'];
}

const classNamePrefix = 'acme-input';

export const classes = {
  root: `${classNamePrefix}-root`,
  input: `${classNamePrefix}`,
  active: `${classNamePrefix}-active`,
  size: (size: InputProps['size']) => `${classNamePrefix}-${size}`,
  status: (status: InputProps['status']) => `${classNamePrefix}-${status}`,
  disabled: `${classNamePrefix}-disabled`,
  full: `${classNamePrefix}-full`,
  number: `${classNamePrefix}-number`,
  loadingIcon: `${classNamePrefix}-loading-icon`,
  clear: `${classNamePrefix}-clear-icon`,
};

const mergeWithContextProps: FormFieldPropKeysType = ['id', 'status', 'disabled', 'fullWidth'];

const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>> =
  React.forwardRef((props: InputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {
      className,
      placeholder,
      size,
      limit,
      defaultValue,
      value,
      onChange,
      onFocus,
      onBlur,
      type,
      style,
      clear,
      onClear,
      startElement,
      endElement,
      ...otherProps
    } = props;

    const [currentValue, setCurrentValue] = React.useState(defaultValue);
    if ('value' in props) {
      React.useEffect(() => {
        setCurrentValue(value);
      }, [value]);
    }

    const [currentValueLen, setCurrentValueLen] = React.useState(0);
    const propValueLength = isString(currentValue) ? currentValue.length : 0;
    const [limitError, setLimitError] = React.useState(limit ? propValueLength > limit : false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const internalValue = get(e, 'target.value');
      if (!('value' in props)) {
        setCurrentValue(internalValue);
      }
      if (isFunction(onChange)) {
        onChange(e);
      }
    };

    React.useEffect(() => {
      const valueLength = isString(currentValue) ? currentValue.length : 0;
      setCurrentValueLen(valueLength);
      if (limit) {
        setLimitError(valueLength > limit);
      }
    }, [currentValue, limit]);

    const [isFocus, setIsFocus] = React.useState(false);
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isFunction(onFocus)) {
        onFocus(e);
      }
      setIsFocus(true);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (isFunction(onBlur)) {
        onBlur(e);
      }
      setIsFocus(false);
    };

    const [isPassword, setIsPassword] = React.useState(!!(type === 'password'));
    const handlePasswordVisible = () => {
      setIsPassword(!isPassword);
    };
    const passwordType = isPassword ? 'password' : 'text';

    const handleInputClear = () => {
      setCurrentValue('');
      if (isFunction(onChange)) {
        onChange();
      }
      if (isFunction(onClear)) {
        onClear();
      }
    };

    const formFieldContext = useFormField();
    const mergedProps = mergeFormFieldProps<InputProps>({
      props,
      propKeys: mergeWithContextProps,
      context: formFieldContext,
    });
    const error = mergedProps.status === 'error' || limitError;

    return (
      <div
        className={uniteClassNames(
          classes.root,
          isFocus ? classes.active : '',
          mergedProps.status ? classes.status(mergedProps.status) : '',
          error ? classes.status('error') : '',
          mergedProps.disabled ? classes.disabled : '',
          mergedProps.fullWidth ? classes.full : '',
          type === 'number' ? classes.number : '',
          className,
        )}
        style={style}
        data-testid="acme-input-root"
      >
        {startElement ? (
          <div className={`${classNamePrefix}-start-element`}>{startElement}</div>
        ) : null}
        <input
          className={uniteClassNames(classes.input, classes.size(size))}
          id={mergedProps.id}
          aria-invalid={error}
          aria-describedby={get(formFieldContext, 'hintId')}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={mergedProps.disabled}
          value={currentValue || ''}
          type={type === 'password' ? passwordType : type}
          {...omit(otherProps, mergeWithContextProps)}
          ref={ref}
        />
        {clear ? (
          <ClearSvg
            className={uniteClassNames(
              classes.clear,
              currentValue ? `${classNamePrefix}-clear-appear` : '',
            )}
            onClick={handleInputClear}
          />
        ) : null}
        {limit ? (
          <div
            className={uniteClassNames(
              `${classNamePrefix}-limit`,
              limitError ? `${classNamePrefix}-limit-error` : '',
            )}
          >{`${currentValueLen}/${limit}`}</div>
        ) : null}
        {mergedProps.status === 'success' ? <SuccessSvg /> : null}
        {mergedProps.status === 'loading' ? (
          <PrimaryLoadingSvg className={classes.loadingIcon} />
        ) : null}
        {type === 'password' ? (
          <span className={`${classNamePrefix}-password-icon`} onClick={handlePasswordVisible}>
            {isPassword ? <PasswordOpenEyeSvg /> : <PasswordCloseEyeSvg />}
          </span>
        ) : null}
        {endElement ? <div className={`${classNamePrefix}-end-element`}>{endElement}</div> : null}
      </div>
    );
  });

Input.defaultProps = {
  size: 'default',
  type: 'text',
};
export default Input;
