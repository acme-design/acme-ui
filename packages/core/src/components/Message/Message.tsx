import * as React from 'react';
import ReactDOM from 'react-dom';
import isFunction from 'lodash/isFunction';
import { uniteClassNames } from '../../utils/tools';

import './style/Message.less';
import { MessageType } from './types';
import DeleteSvg from '../Icon/Delete';
import Notice from '../Notice/Notice';

type TMessageType = `${MessageType}`;

export interface MessageContentProps {
  className?: string;
  content?: React.ReactNode;
  type: TMessageType;
  onClose?: () => void;
  during?: number;
  key: string;
}

export interface MessageDomState {
  messages: MessageContentProps[];
}

export interface MessageDomProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const classNamePrefix = 'acme-message';

export const classes = {
  root: `${classNamePrefix}`,
  item: `${classNamePrefix}-item`,
  appearance: (type: MessageContentProps['type']) => `${classNamePrefix}-${type}`,
  content: `${classNamePrefix}-content`,
  hide: `${classNamePrefix}-hide`,
  close: `${classNamePrefix}-close`,
};

class MessageDom extends React.PureComponent<MessageDomProps, MessageDomState> {
  constructor(props: MessageDomProps) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  private handlerClose = (onClose?: () => void, key?: string) => {
    const { messages } = this.state;
    this.setState({
      messages: messages.filter((item) => item.key !== key),
    });
    if (isFunction(onClose)) {
      onClose();
    }
  };

  public add = (props: MessageContentProps) => {
    const { type, className, content, onClose, key } = props;
    const { messages } = this.state;
    const newMessage = [
      ...messages,
      {
        ...props,
        content: (
          <div className={uniteClassNames(classes.item, classes.appearance(type), className)}>
            <div className={classes.content}>{content}</div>
            <span
              className={classes.close}
              onClick={() => {
                this.handlerClose(onClose, key);
              }}
            >
              <DeleteSvg />
            </span>
          </div>
        ),
      },
    ];
    this.setState({
      messages: newMessage,
    });
  };

  public render() {
    const { messages } = this.state;
    const { className, ...resetProps } = this.props;
    return (
      <div className={uniteClassNames(classes.root, className)} {...resetProps}>
        {messages.map((message) => (
          <Notice
            key={message.key}
            content={message.content}
            close={() => this.handlerClose(message.onClose, message.key)}
            during={message.during}
          />
        ))}
      </div>
    );
  }
}

function messageInstance(): InstanceInterface {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const ref = React.createRef<MessageDom>();
  ReactDOM.render(<MessageDom ref={ref} />, div);

  return {
    add(message: MessageContentProps) {
      const { current } = ref;
      current?.add(message);
    },
    destroy() {
      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
    },
  };
}

export interface InstanceInterface {
  add: (message: Omit<MessageContentProps, 'content'>) => void;
  destroy: () => void;
}

export default messageInstance;
