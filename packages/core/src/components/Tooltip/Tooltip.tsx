import * as React from 'react';
import { createPopper, Instance } from '@popperjs/core';
import includes from 'lodash/includes';
import get from 'lodash/get';
import { uniteClassNames } from '../../utils/tools';
import { TooltipPlacement } from './types';
import './style/Tooltip.less';

type TooltipPlacementType = `${TooltipPlacement}`;

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 子元素
   */
  children: React.ReactNode;
  /**
   * 提示内容
   */
  content: React.ReactNode;
  /**
   * 提示框的最大宽度
   */
  width?: string | number;
  /**
   * 提示框的触发方式, 目前只支持hover/click/focus
   */
  trigger?: string | string[];
  /**
   * 提示框出现的延时时间，单位：秒？还是毫秒？（TODO 目前暂时用了秒）
   */
  delay?: number;
  /**
   * 提示框位置
   */
  placement?: TooltipPlacementType;
  /**
   * 提示框类名
   */
  overlayClassName?: string;
  /**
   * 提示框样式
   */
  overlayStyle?: React.HTMLAttributes<HTMLDivElement>['style'];
  /**
   * 提示框翻转边界 默认为document
   */
  boundary?: React.ReactElement;
}

const classNamePrefix = `acme-tooltip`;

export const classes = {
  root: `${classNamePrefix}-root`,
  popper: `${classNamePrefix}-popper`,
  reference: `${classNamePrefix}-reference`,
  arrow: `${classNamePrefix}-arrow`,
  hidden: `${classNamePrefix}-hidden`,
  tooltip: `${classNamePrefix}-tooltip`,
};

const Tooltip: React.ForwardRefExoticComponent<TooltipProps & React.RefAttributes<HTMLDivElement>> =
  React.forwardRef((props: TooltipProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const {
      children,
      content,
      width,
      trigger,
      delay,
      placement,
      overlayClassName,
      overlayStyle,
      boundary,
      ...otherProps
    } = props;

    let showTimeout: NodeJS.Timeout | null = null;
    let hideTimeout: NodeJS.Timeout | null = null;
    let popper: Instance;
    const referenceRef: React.RefObject<HTMLDivElement> = React.createRef();
    const popperRef: React.RefObject<HTMLDivElement> = React.createRef();

    const [isShowPopper, setIsShowPopper] = React.useState(false);

    const show = () => {
      if (delay) {
        showTimeout = setTimeout(() => {
          setIsShowPopper(true);
          popper.update();
        }, delay * 1000);
      } else {
        setIsShowPopper(true);
        popper.update();
      }
    };

    const hide = () => {
      if (delay) {
        hideTimeout = setTimeout(() => {
          setIsShowPopper(false);
        }, delay * 1000);
      } else {
        setIsShowPopper(false);
      }
    };

    const handleClickEvent = () => {
      const childrenDom = get(referenceRef, 'current');
      if (childrenDom) {
        childrenDom.addEventListener('click', (e: Event) => {
          if (e) e.stopPropagation();
          show();
        });
        document.addEventListener('click', hide);
      }
    };

    const handleHoverEvent = () => {
      const childrenDom = get(referenceRef, 'current');
      if (childrenDom) {
        childrenDom.addEventListener('mouseenter', show);
        childrenDom.addEventListener('mouseout', hide);
      }
    };

    const handleFocusEvent = () => {
      const childrenDom = get(referenceRef, 'current');
      if (childrenDom) {
        childrenDom.addEventListener('focusin', show);
        childrenDom.addEventListener('focusout', hide);
      }
    };

    React.useEffect(() => {
      const childrenDom = get(referenceRef, 'current');
      const popperDom = get(popperRef, 'current');
      if (childrenDom && popperDom) {
        popper = createPopper(childrenDom, popperDom, {
          placement,
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
              name: 'flip',
              options: {
                padding: 5,
                fallbackPlacement: ['left', 'right', 'top', 'bottom'],
                boundary,
              },
            },
          ],
        });
      }

      if (includes(trigger, 'hover')) {
        handleHoverEvent();
      }
      if (includes(trigger, 'click')) {
        handleClickEvent();
      }
      if (includes(trigger, 'focus')) {
        handleFocusEvent();
      }

      return () => {
        if (showTimeout) clearTimeout(showTimeout);
        if (hideTimeout) clearTimeout(hideTimeout);
        // 把所有监听的事件移除
        if (childrenDom) {
          childrenDom.removeEventListener('click', (e: Event) => {
            if (e) e.stopPropagation();
            show();
          });
          document.removeEventListener('click', hide);
          childrenDom.removeEventListener('mouseenter', show);
          childrenDom.removeEventListener('mouseout', hide);
          childrenDom.removeEventListener('focusin', show);
          childrenDom.removeEventListener('focusout', hide);
        }
      };
    }, [content]);

    return (
      <div className={classes.root} ref={ref} {...otherProps}>
        <div ref={referenceRef} className={classes.reference}>
          {children}
        </div>
        <div
          ref={popperRef}
          className={uniteClassNames(
            classes.popper,
            overlayClassName,
            isShowPopper ? '' : classes.hidden,
          )}
          style={{ maxWidth: width, ...overlayStyle }}
          data-testid="acme-popper"
        >
          <div id={classes.arrow} data-popper-arrow className={classes.arrow} />
          <div className={classes.tooltip}>{content}</div>
        </div>
      </div>
    );
  });

Tooltip.defaultProps = {
  trigger: 'hover',
  placement: 'auto',
};

export default Tooltip;
