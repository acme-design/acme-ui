import * as React from 'react';
import get from 'lodash/get';
import Tag, { TagProps } from '../Tag';
import './style/TagInput.less';

export interface TagInputProps extends TagProps {
  /**
   * 样式类名
   */
  className?: string;
  /**
   * 值集合
   */
  value: string[] | number[] | React.ReactNode[]; // TODO 是否需要 保留node类型
}

interface TagInputState {
  value: string[] | number[]; // TODO 应该是取自input的value类型
}

const classNamePrefix = 'acme-tag-input';

export const classes = {
  root: classNamePrefix,
};

class TagInput extends React.PureComponent<TagInputProps, TagInputState> {
  constructor(props: TagInputProps) {
    super(props);
    this.state = {
      value: [],
    };
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = get(e, 'target.value');
    const { value } = this.state;
    this.setState({
      value: [...value, val],
    });
  };

  render(): React.ReactNode {
    const { value: propValue } = this.props;
    return (
      <div className={classes.root}>
        {((propValue as string[]) || (propValue as number[])).map(
          (v: string | number, index: number) => {
            const tagKey = `${v}${index}`;
            return <Tag key={tagKey}>{v}</Tag>;
          },
        )}
        <input onChange={this.handleChange} />
      </div>
    );
  }
}
export default TagInput;
