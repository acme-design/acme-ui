import * as React from 'react';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';

export interface NoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 唯一标识
   */
  key: string;
  /**
   * 外层样式名
   */
  className?: string;
  /**
   * 展示内容
   */
  content: React.ReactNode;
  /**
   * 自动关闭的延时，单位：毫秒。设为 0 时不自动关闭
   */
  duration?: number;
  /**
   * 关闭回调
   */
  onClose?: () => void;
}

class Notice extends React.PureComponent<NoticeProps> {
  private closeTimer: NodeJS.Timeout | null = null;

  static defaultProps = {
    duration: 3000,
  };

  componentDidMount() {
    this.startClose();
  }

  componentDidUpdate(prevProps: NoticeProps) {
    const { duration } = this.props;
    if (duration !== prevProps.duration) {
      this.restartClose();
    }
  }

  componentWillUnmount() {
    this.clearClose();
  }

  private close = () => {
    const { onClose } = this.props;

    this.clearClose();
    if (isFunction(onClose)) onClose();
  };

  private startClose = () => {
    const { duration } = this.props;
    if (duration) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, duration);
    }
  };

  private clearClose = () => {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  };

  private restartClose = () => {
    this.clearClose();
    this.startClose();
  };

  public render() {
    const { className, content, ...restProps } = this.props;
    return (
      <div className={className} {...omit(restProps, ['duration', 'onClose'])}>
        {content}
      </div>
    );
  }
}

export default Notice;
