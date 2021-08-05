import Message from './Message';
import { MessageType, MessageConfig } from './types';

let message: ReturnType<typeof Message.newInstance> | null = null;

const getMessageKey = (): string => {
  return `message:${new Date().getTime()}:${Math.random() * 1000}`;
};

type MessageApiConfig = Omit<MessageConfig, 'key'>;

// 1. key选填，默认值=按照时间戳随机生成
// 2. type选填，默认值=MessageType.INFO
const openInstance = (messageProps: MessageApiConfig & { key?: MessageConfig['key'] }): void => {
  if (!message) {
    message = Message.newInstance();
  }
  message.add({ key: getMessageKey(), ...messageProps });
};

const MessageApi = {
  info: (config: MessageApiConfig) => openInstance({ ...config, type: MessageType.INFO }),
  warning: (config: MessageApiConfig) => openInstance({ ...config, type: MessageType.WARNING }),
  success: (config: MessageApiConfig) => openInstance({ ...config, type: MessageType.SUCCESS }),
  error: (config: MessageApiConfig) => openInstance({ ...config, type: MessageType.ERROR }),
  loading: (config: MessageApiConfig) => openInstance({ ...config, loading: true }),
  config: Message.config,
  open: openInstance,
  destroy: (key?: string) => {
    if (!message) return;

    if (key) {
      message.remove(key);
    } else {
      message.destroy();
      message = null;
    }
  },
};

export default MessageApi;
