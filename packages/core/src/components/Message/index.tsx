import { NoticeInstanceType } from '../Notice/types';
import MessageDom, { classes, MessageProps } from './Message';
import NoticeInstance from '../Notice/Notice';

let notice: NoticeInstanceType<MessageProps>;

const messageInstance = (props: MessageProps): void => {
  if (!notice) {
    notice = NoticeInstance({ Content: MessageDom, className: classes.wrap });
  }
  if (props) {
    notice.add(props);
  }
};

type MessageType = {
  info: (props?: MessageProps) => void;
  warning: (props?: MessageProps) => void;
};

const Message: MessageType = {
  info: (props?: MessageProps) => messageInstance({ ...props, type: 'info' }),
  warning: (props?: MessageProps) => messageInstance({ ...props, type: 'warning' }),
};

export type { MessageProps } from './Message';

export default Message;
