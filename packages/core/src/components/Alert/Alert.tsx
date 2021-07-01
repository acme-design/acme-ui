import * as React from 'react';
import isFunction from 'lodash/isFunction';
import { AlertAlign, AlertType } from './types';
import { uniteClassNames } from '../../utils/tools';

import './style/Alert.less';
import DeleteSvg from '../Icon/Delete';
import InfoIcon from '../Icon/Info';
import SuccessIcon from '../Icon/Success';
import WarningIcon from '../Icon/Warning';
import ErrorIcon from '../Icon/Error';

type AlertTypeType = `${AlertType}`;
type AlertAlignType = `${AlertAlign}`;

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * 外层class名
   */
  className?: string;
  /**
   * alert 类型
   */
  type?: AlertTypeType;
  /**
   * 文案位置
   */
  align?: AlertAlignType;
  /**
   * 是否显示关闭按钮
   */
  closable?: boolean;
  /**
   * alert 关闭事件
   */
  onClose?: (e: React.MouseEvent) => void;
  /**
   * alert 头部内容
   */
  title?: React.ReactNode;
  /**
   * 自定义icon
   */
  icon?: React.ReactNode;
  /**
   * 是否展示默认icon
   */
  showIcon?: boolean;
  /**
   * 自定义操作
   */
  action?: React.ReactNode;
}

const classPrefix = 'acme-alert';

export const classes = {
  root: classPrefix,
  appearance: (type: AlertProps['type']) => `${classPrefix}-${type}`,
  visible: `${classPrefix}-visible`,
  content: `${classPrefix}-content`,
  align: (align: AlertProps['align']) => `${classPrefix}-content-${align}`,
  title: `${classPrefix}-title`,
  description: `${classPrefix}-description`,
  closeWrap: `${classPrefix}-close-wrap`,
  close: `${classPrefix}-close`,
  icon: `${classPrefix}-icon`,
  largeIcon: `${classPrefix}-icon-large`,
  iconWrap: `${classPrefix}-icon-wrap`,
  largeIconWrap: `${classPrefix}-icon-large-wrap`,
};

const AlertIcon = {
  info: (className: string) => <InfoIcon className={className} />,
  warning: (className: string) => <WarningIcon className={className} />,
  success: (className: string) => <SuccessIcon className={className} />,
  error: (className: string) => <ErrorIcon className={className} />,
};

const Alert = React.forwardRef((props: AlertProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const {
    className,
    type,
    title,
    action,
    closable,
    onClose,
    showIcon,
    icon,
    children,
    align,
    ...otherProps
  } = props;
  const [visible, setVisible] = React.useState(false);

  const handleClose = (e: React.MouseEvent) => {
    setVisible(true);
    if (isFunction(onClose)) {
      onClose(e);
    }
  };

  const hasClose = closable || isFunction(onClose);

  const hasIcon = showIcon || React.isValidElement(icon);

  return (
    <div
      className={uniteClassNames(
        classes.root,
        classes.appearance(type),
        visible ? classes.visible : '',
        className,
      )}
      ref={ref}
      {...otherProps}
    >
      {hasIcon ? (
        <span className={uniteClassNames(classes.iconWrap, title ? classes.largeIconWrap : '')}>
          {icon || AlertIcon[type as AlertTypeType](title ? classes.largeIcon : classes.icon)}
        </span>
      ) : null}
      <div className={uniteClassNames(classes.content, classes.align(align))}>
        {title ? <div className={classes.title}>{title}</div> : null}
        <div className={classes.description}>{children}</div>
      </div>
      {action ? <div>{action}</div> : null}
      {hasClose ? (
        <div className={classes.closeWrap} onClick={handleClose}>
          <DeleteSvg className={classes.close} />
        </div>
      ) : null}
    </div>
  );
});

Alert.defaultProps = {
  type: 'info',
  align: 'left',
};

export default Alert;
