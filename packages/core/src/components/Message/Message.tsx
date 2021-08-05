import * as React from 'react';
import * as ReactDOM from 'react-dom';
import get from 'lodash/get';
import omit from 'lodash/omit';
import isFunction from 'lodash/isFunction';
import { uniteClassNames } from '../../utils/tools';
import {
  MessageType,
  MessageConfig,
  MessageInstance,
  MessageOptions,
  MessageInstanceConfig,
} from './types';
import CloseSvg from '../Icon/Close';
import InfoIcon from '../Icon/Info';
import SuccessIcon from '../Icon/Success';
import WarningIcon from '../Icon/Warning';
import ErrorIcon from '../Icon/Error';
import { PrimaryLoadingSvg } from '../Icon/LoadingIcon';
import Notice from '../Notice/Notice';
import './style/Message.less';

const classNamePrefix = 'acme-message';

export const classes = {
  root: `${classNamePrefix}`,
  item: `${classNamePrefix}-item`,
  appearance: (type: MessageConfig['type']) => `${classNamePrefix}-${type}`,
  loading: `${classNamePrefix}-loading`,
  content: `${classNamePrefix}-content`,
  contentClosable: `${classNamePrefix}-content-closable`,
  icon: `${classNamePrefix}-icon`,
  close: `${classNamePrefix}-close`,
};

const MessageIcon = {
  [MessageType.INFO]: <InfoIcon />,
  [MessageType.WARNING]: <WarningIcon />,
  [MessageType.SUCCESS]: <SuccessIcon />,
  [MessageType.ERROR]: <ErrorIcon />,
  loading: <PrimaryLoadingSvg />,
};

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  initialConfig?: MessageInstanceConfig;
}

export interface MessageState {
  messages: MessageConfig[];
}

class Message extends React.PureComponent<MessageProps, MessageState> {
  static newInstance: (initialConfig?: MessageProps['initialConfig']) => MessageInstance;

  private generalConfig: MessageInstanceConfig = {};

  constructor(props: MessageProps) {
    super(props);

    const { initialConfig } = props || {};
    if (initialConfig) {
      this.config(initialConfig);
    }

    this.state = {
      messages: [],
    };
  }

  public add = (config: MessageConfig) => {
    const { messages } = this.state;
    const { type, closable, loading, content, ...restConfig } = config || {};
    const icon = loading ? MessageIcon.loading : MessageIcon[type];
    const newMessage = {
      ...this.generalConfig,
      ...restConfig,
      type,
      content: (
        <>
          <div
            className={uniteClassNames(classes.content, closable ? classes.contentClosable : '')}
          >
            {icon ? (
              <span className={uniteClassNames(classes.icon, loading ? classes.loading : '')}>
                {icon}
              </span>
            ) : null}
            {content}
          </div>
          {closable ? (
            <CloseSvg className={classes.close} onClick={() => this.handlerClose(config)} />
          ) : null}
        </>
      ),
    };

    const existIdx = messages.findIndex(({ key }) => key === get(config, 'key'));
    if (existIdx > -1) {
      const newMessages = messages.slice();
      newMessages[existIdx] = newMessage;
      this.setState({
        messages: newMessages,
      });
    } else {
      this.setState({
        messages: [...messages, newMessage],
      });
    }
  };

  public remove = (key: string) => {
    const { messages } = this.state;
    this.setState({
      messages: messages.filter((item) => item.key !== key),
    });
  };

  public config = (config: MessageInstanceConfig) => {
    this.generalConfig = { ...this.generalConfig, ...config };
  };

  private handlerClose = (config: MessageConfig) => {
    const { key, onClose } = config || {};
    this.remove(key);
    if (isFunction(onClose)) {
      onClose();
    }
  };

  public render() {
    const { className, ...restProps } = this.props;
    const { messages } = this.state;
    return (
      <div
        className={uniteClassNames(classes.root, className)}
        {...omit(restProps, 'initialConfig')}
      >
        {messages.map((message: MessageConfig) => (
          <Notice
            key={get(message, 'key')}
            className={uniteClassNames(
              classes.item,
              classes.appearance(get(message, 'type')),
              get(message, 'className'),
            )}
            content={get(message, 'content')}
            duration={get(message, 'duration')}
            onClose={() => this.handlerClose(message)}
          />
        ))}
      </div>
    );
  }
}

Message.newInstance = (options?: MessageOptions) => {
  const { getContainer, ...restOptions } = options || {};
  const container = document.createElement('div');
  if (getContainer) {
    const root = getContainer();
    if (root) root.appendChild(container);
  } else {
    document.body.appendChild(container);
  }

  const ref = React.createRef<Message>();
  ReactDOM.render(<Message ref={ref} initialConfig={restOptions} />, container);

  return {
    add(message: MessageConfig) {
      const { current } = ref;
      current?.add(message);
    },
    remove(key: string) {
      const { current } = ref;
      current?.remove(key);
    },
    destroy() {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    },
  };
};

export default Message;