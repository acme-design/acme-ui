import * as React from 'react';

export interface NoticeProps {
  className?: string;
  closeClassName?: string;
  content: React.ReactNode;
  close: () => void;
  during?: number;
}

export interface NoticeState {
  timer: NodeJS.Timeout;
}

class Notice extends React.PureComponent<NoticeProps, NoticeState> {
  timer: NodeJS.Timeout | undefined;

  componentDidMount() {
    this.startClose();
  }

  componentWillUnmount() {
    this.endClose();
  }

  private startClose = () => {
    const { close, during = 2 } = this.props;
    this.timer = setTimeout(() => {
      close();
    }, during * 1000);
  };

  private endClose = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  };

  public render() {
    const { className, content } = this.props;
    return (
      <div className={className}>
        <div>{content}</div>
      </div>
    );
  }
}

export default Notice;
