import * as React from 'react';
import * as ReactDOM from 'react-dom';
import isFunction from 'lodash/isFunction';
import { uniteClassNames } from '../../utils/tools';
import './style/Modal.less';

const classNamePrefix = 'acme-modal';

export const classes = {
  root: classNamePrefix,
  backdrop: `${classNamePrefix}-backdrop`,
  hidden: `${classNamePrefix}-hidden`,
};

type ContainerType = HTMLElement | React.ReactNode;

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 样式类名
   */
  className?: string;
  /**
   * 展示内容
   */
  children: React.ReactNode;
  /**
   * If `true`, the component is shown.
   */
  visible?: boolean;
  /**
   * An HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */
  container?: ContainerType | (() => ContainerType);
  /**
   * Callback fired when the component requests to be closed.
   */
  onClose?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  /**
   * Callback fired when the backdrop is clicked.
   */
  onBackdropClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  /**
   * Always keep the children in the DOM.
   */
  keepMounted?: boolean;
  /**
   * If `true`, the backdrop is not rendered.
   */
  hideBackdrop?: boolean;
}

function getContainer(container: ModalProps['container']) {
  return isFunction(container) ? container() : container;
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (props: ModalProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const {
      className,
      children,
      container,
      visible,
      onClose,
      onBackdropClick,
      keepMounted,
      hideBackdrop,
      ...otherProps
    } = props || {};
    const [mountNode, setMountNode] = React.useState<ContainerType>(null);

    React.useEffect(() => {
      setMountNode(getContainer(container) || document.body);
    }, [container]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (isFunction(onBackdropClick)) {
        onBackdropClick(e);
      }

      if (isFunction(onClose)) {
        onClose(e);
      }
    };

    if (!keepMounted && !visible) {
      return null;
    }

    return mountNode
      ? ReactDOM.createPortal(
          <div
            className={uniteClassNames(
              classes.root,
              keepMounted && !visible ? classes.hidden : '',
              className,
            )}
            role="presentation"
            {...otherProps}
            ref={ref}
          >
            {hideBackdrop ? null : (
              <div className={classes.backdrop} onClick={handleBackdropClick} />
            )}
            {children}
          </div>,
          mountNode as Element,
        )
      : null;
  },
);

export default Modal;
