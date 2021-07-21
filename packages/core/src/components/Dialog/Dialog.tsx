import * as React from 'react';
import isFunction from 'lodash/isFunction';
import { uniteClassNames } from '../../utils/tools';
import Modal, { ModalProps } from '../Modal';
import './style/Dialog.less';

const classNamePrefix = 'acme-dialog';

export const classes = {
  root: classNamePrefix,
  container: `${classNamePrefix}-container`,
  inner: `${classNamePrefix}-inner`,
  title: `${classNamePrefix}-title`,
  content: `${classNamePrefix}-content`,
  dividers: `${classNamePrefix}-dividers`,
  actions: `${classNamePrefix}-actions`,
};

export interface DialogProps extends Omit<ModalProps, 'className' | 'children' | 'title'> {
  /**
   * 样式类名
   */
  className?: string;
  /**
   * 对话框标题
   */
  title?: React.ReactNode;
  /**
   * 对话框中间展示部分
   */
  children?: React.ReactNode;
  /**
   * 对话框操作区域
   */
  actions?: React.ReactNode;
  /**
   * Display the top and bottom dividers.
   */
  dividers?: boolean;
  /**
   * 宽度
   */
  width?: number | string;
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (props: DialogProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const {
      className,
      children,
      title,
      actions,
      dividers,
      width,
      onBackdropClick,
      onClose,
      ...otherProps
    } = props || {};

    const containerClicked = React.useRef<boolean>();
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      containerClicked.current = event.target === event.currentTarget;
    };

    const handleModalClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      // 只有container被点击到才认为需要被关闭
      if (!containerClicked.current) {
        return;
      }

      if (isFunction(onBackdropClick)) {
        onBackdropClick(event);
      }

      if (isFunction(onClose)) {
        onClose(event);
      }
    };

    return (
      <Modal
        className={uniteClassNames(classes.root, className)}
        {...otherProps}
        ref={ref}
        onClick={handleModalClick}
      >
        <div
          className={classes.container}
          data-testid="acme-test-dialog-container"
          onMouseDown={handleMouseDown}
        >
          <div className={classes.inner} role="dialog" style={width ? { width } : {}}>
            {title ? <div className={classes.title}>{title}</div> : null}
            {children ? (
              <div className={uniteClassNames(classes.content, dividers ? classes.dividers : '')}>
                {children}
              </div>
            ) : null}
            {actions ? <div className={classes.actions}>{actions}</div> : null}
          </div>
        </div>
      </Modal>
    );
  },
);

export default Dialog;
