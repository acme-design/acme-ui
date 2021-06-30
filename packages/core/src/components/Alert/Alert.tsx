import * as React from 'react';
import isFunction from 'lodash/isFunction';
import { AlertType } from './types';
import { uniteClassNames } from '../../utils/tools';

import './style/Alert.less';
import DeleteSvg from '../Icon/Delete';
import InfoIcon from '../Icon/Info';
import SuccessIcon from '../Icon/Success';
import WarningIcon from '../Icon/Warning';
import ErrorIcon from '../Icon/Error';

type AlertTypeType = `${AlertType}`;

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * 外层class名
   */
  className?: string;
  /**
   * alert 类型
   */
  type: AlertTypeType;
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
  action: React.ReactNode;
}

const classPrefix = 'acme-alert';

export const classes = {
  root: classPrefix,
  appearance: (type: AlertProps['type']) => `${classPrefix}-${type}`,
  visible: `${classPrefix}-visible`,
  content: `${classPrefix}-content`,
  title: `${classPrefix}-title`,
  description: `${classPrefix}-description`,
  closeWrap: `${classPrefix}-close-wrap`,
  close: `${classPrefix}-close`,
  icon: `${classPrefix}-icon`,
  largeIcon: `${classPrefix}-icon-large`,
  iconWrap: `${classPrefix}-icon-wrap`,
};

const AlertIcon = {
  info: (className: string) => <InfoIcon className={className} />,
  warning: (className: string) => <WarningIcon className={className} />,
  success: (className: string) => <SuccessIcon className={className} />,
  error: (className: string) => <ErrorIcon className={className} />,
};

const Alert = React.forwardRef((props: AlertProps, ref: React.ForwardedRef<HTMLDivElement>) => {
  const { className, type, title, action, closable, onClose, showIcon, icon, children } = props;
  const [visible, setVisible] = React.useState(false);

  const handleClose = (e: React.MouseEvent) => {
    setVisible(true);
    if (isFunction(onClose)) {
      onClose(e);
    }
  };

  const hasClose = closable || Boolean(onClose);

  const hasIcon = showIcon || Boolean(icon);

  return (
    <div
      className={uniteClassNames(
        classes.root,
        classes.appearance(type),
        visible ? classes.visible : '',
        className,
      )}
      ref={ref}
    >
      {hasIcon ? (
        <span className={classes.iconWrap}>
          {icon || AlertIcon[type](title ? classes.largeIcon : classes.icon)}
        </span>
      ) : null}
      <div className={classes.content}>
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
};

export default Alert;
