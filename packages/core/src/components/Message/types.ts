import { MessageProps } from './index';

export enum MessageType {
  INFO = 'info',
  SUCCESS = 'SUCCESS',
  WARNING = 'warning',
  ERROR = 'error',
}

export type TMessage = {
  info: (props?: MessageProps) => void;
  warning: (props?: MessageProps) => void;
};
