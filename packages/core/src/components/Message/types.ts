import { MessageProps } from './index';

export enum MessageType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export type TMessage = {
  info: (props?: MessageProps) => void;
  warning: (props?: MessageProps) => void;
};
