import { NoticeProps } from '../Notice';

export enum MessageType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

type TMessageType = `${MessageType}`;

export interface MessageConfig extends NoticeProps {
  /**
   * 提示类型
   */
  type: TMessageType;
  /**
   * 是否可关闭
   */
  closable?: boolean;
  /**
   * 是否为加载中状态
   */
  loading?: boolean;
}

// Message默认配置
export interface MessageInstanceConfig {
  /**
   * 默认自动关闭延迟时长
   */
  duration?: number;
}

// Message全局通用配置
export interface MessageOptions extends MessageInstanceConfig {
  /**
   * message 挂载节点
   */
  getContainer?: () => HTMLElement;
}

export interface MessageInstance {
  add: (message: MessageConfig) => void;
  remove: (key: string) => void;
  destroy: () => void;
}
