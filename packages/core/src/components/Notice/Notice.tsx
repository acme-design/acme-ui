import * as React from 'react';
import * as ReactDom from 'react-dom';
import isFunction from 'lodash/isFunction';
import { NoticeInstanceType, NoticeParent } from './types';
import { uniteClassNames } from '../../utils/tools';

export interface NoticeProps<T> {
  className: string;
  closeClassName?: string;
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
    const newNotices = [...notices, notice];
    this.setState({
      notices: newNotices,
    });
    const delay = (notice.delay || 3000) + 100 * notices.length;
    const timer = setTimeout(() => {
      this.remove(notice.key, notice.onClose);
      clearTimeout(timer);
    }, delay);
  };

  private visibleItem = (key: string) => {
    const { notices } = this.state;
    const { closeClassName } = this.props;
    const newNotices = notices.map((notice) => {
      if (notice.key === key)
        return {
          ...notice,
          className: uniteClassNames(notice.className, closeClassName),
        };
      return notice;
    });
    this.setState({ notices: newNotices });
  };

  public remove = (key: string, onClose?: () => void) => {
    const { notices } = this.state;

    if (isFunction(onClose)) {
      onClose();
    }
    this.visibleItem(key);
    const closeTimer = setTimeout(() => {
      this.setState({
        notices: notices.filter((notice) => notice.key !== key),
      });
      clearTimeout(closeTimer);
    }, 150);
  };

  public render() {
    const { notices } = this.state;
    const { className, Content } = this.props;
    return notices.length > 0 ? (
      <div className={className}>
        {notices.map((notice) => (
          <Content {...notice} onClose={() => this.remove(notice.key, notice.onClose)} />
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
