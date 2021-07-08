import * as React from 'react';
import { ForwardedRef } from 'react';
import isFunction from 'lodash/isFunction';
import { uniteClassNames } from '../../utils/tools';

import './style/Message.less';
import { NoticeParent } from '../Notice/types';
import { MessageType } from './types';
import DeleteSvg from '../Icon/Delete';

type TMessageType = `${MessageType}`;

export interface MessageDomProps extends NoticeParent {
  content?: string;
  type: TMessageType;
}

const classNamePrefix = 'acme-message';

export const classes = {
  root: `${classNamePrefix}`,
  wrap: `${classNamePrefix}-wrap`,
  appearance: (type: MessageDomProps['type']) => `${classNamePrefix}-${type}`,
  content: `${classNamePrefix}-content`,
  hide: `${classNamePrefix}-hide`,
  close: `${classNamePrefix}-close`,
};

const MessageDom = React.forwardRef((props: MessageDomProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { type, className, content, onClose } = props;

  const handlerClose = () => {
    if (isFunction(onClose)) {
      onClose();
    }
  };

  return (
    <div className={uniteClassNames(classes.root, classes.appearance(type), className)} ref={ref}>
      <div className={classes.content}>{content}</div>
      <span className={classes.close} onClick={handlerClose}>
        <DeleteSvg />
      </span>
    </div>
  );
});

MessageDom.defaultProps = {
  type: 'info',
};

export default MessageDom;
