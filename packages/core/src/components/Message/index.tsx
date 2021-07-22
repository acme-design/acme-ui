import MessageInstance, { InstanceInterface, MessageContentProps } from './Message';
import { TMessage } from './types';

let message: InstanceInterface;

export type MessageProps = Omit<MessageContentProps, 'key'>;

const getMessageKey = (): string => {
  return `message:${new Date().getTime()}:${Math.random() * 1000}`;
};

const messageInstance = (props: MessageProps): void => {
  if (!message) {
    message = MessageInstance();
  }
  if (props) {
    message.add({ ...props, key: getMessageKey() });
  }
};

const Message: TMessage = {
  info: (props?: MessageProps) => messageInstance({ ...props, type: 'info' }),
  warning: (props?: MessageProps) => messageInstance({ ...props, type: 'warning' }),
};

export default Message;
