import * as React from 'react';
import { ForwardedRef } from 'react';
import { uniteClassNames } from '../../utils/tools';

import './style/Message.less';
import { NoticeParent } from '../Notice/types';
import { MessageType } from './types';

type TMessageType = `${MessageType}`;

export interface MessageProps extends NoticeParent {
  className?: string;
  children?: string;
  type: TMessageType;
}

const classNamePrefix = 'acme-message';

export const classes = {
  root: `${classNamePrefix}`,
  wrap: `${classNamePrefix}-wrap`,
  appearance: (type: MessageProps['type']) => `${classNamePrefix}-${type}`,
};

const MessageDom = React.forwardRef((props: MessageProps, ref: ForwardedRef<HTMLDivElement>) => {
  const { type, className, children } = props;
  return (
    <div className={uniteClassNames(classes.root, classes.appearance(type), className)} ref={ref}>
      message 提示信息 {children}
    </div>
  );
});

MessageDom.defaultProps = {
  type: 'info',
};

export default MessageDom;
