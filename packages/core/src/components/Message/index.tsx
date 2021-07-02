import { NoticeInstanceType } from '../Notice/types';
import MessageDom, { classes, MessageDomProps } from './Message';
import NoticeInstance from '../Notice/Notice';
import { TMessage } from './types';

export type MessageProps = Omit<MessageDomProps, 'key'>;

let notice: NoticeInstanceType<MessageDomProps>;

const getMessageKey = (): string => {
  return `message:${new Date().getTime()}:${Math.random() * 1000}`;
};

const messageInstance = (props: MessageProps): void => {
  if (!notice) {
    notice = NoticeInstance({
      Content: MessageDom,
      className: classes.wrap,
      closeClassName: classes.close,
    });
  }
  if (props) {
    notice.add({ key: getMessageKey(), ...props });
  }
};

const Message: TMessage = {
  info: (props?: MessageProps) => messageInstance({ ...props, type: 'info' }),
  warning: (props?: MessageProps) => messageInstance({ ...props, type: 'warning' }),
};

export default Message;
