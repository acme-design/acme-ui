import * as React from 'react';
import * as ReactDom from 'react-dom';
import { NoticeInstanceType, NoticeParent } from './types';

export interface NoticeProps<T> {
  className: string;
  Content: React.ForwardRefExoticComponent<T>;
}

interface NoticesState<T> {
  notices: T[];
}

class Notice<T extends NoticeParent> extends React.Component<NoticeProps<T>, NoticesState<T>> {
  constructor(props: NoticeProps<T>) {
    super(props);
    this.state = {
      notices: [],
    };
  }

  public add = (notice: T) => {
    const { notices } = this.state;
    const key = this.getNoticeKey();
    const newNotices = [...notices, { ...notice, key }];
    this.setState({
      notices: newNotices,
    });
    const timer = setTimeout(() => {
      this.remove(key);
      clearTimeout(timer);
    }, 2000);
  };

  public remove = (key: string) => {
    const { notices } = this.state;
    this.setState({
      notices: notices.filter((notice) => notice.key !== key),
    });
  };

  private getNoticeKey = (): string => {
    return `${new Date().getTime()}:${Math.random() * 100}`;
  };

  public render() {
    const { notices } = this.state;
    const { className, Content } = this.props;
    return notices.length > 0 ? (
      <div className={className}>
        {notices.map((notice) => (
          <Content {...notice} />
        ))}
      </div>
    ) : null;
  }
}

function NoticeInstance<T extends NoticeParent>(props: NoticeProps<T>): NoticeInstanceType<T> {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const ref = React.createRef<Notice<T>>();
  ReactDom.render(<Notice ref={ref} {...props} />, div);

  return {
    add(notice: T) {
      const { current } = ref;
      return current?.add(notice);
    },
    destroy() {
      ReactDom.unmountComponentAtNode(div);
      document.body.removeChild(div);
    },
  };
}

export default NoticeInstance;
