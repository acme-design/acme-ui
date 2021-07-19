import * as React from 'react';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import Input, { InputProps } from '../Input';
import { IconPlacement } from './types';
import { uniteClassNames } from '../../utils/tools';
import './style/SearchInput.less';

type IconPlacementType = `${IconPlacement}`;

export interface SearchInputProps extends InputProps {
  /**
   * 样式类名
   */
  className?: string;
  /**
   * 搜索图标的放置位置
   */
  iconPlacement?: IconPlacementType;
  /**
   * 点击搜索图标或者是enter键调用的方法
   */
  onSearch: (value: string) => void;
}

const classNamePrefix = 'acme-search-input';

export const classes = {
  root: classNamePrefix,
  searchIcon: `${classNamePrefix}-search-icon`,
};

const SearchInput = React.forwardRef(
  (props: SearchInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const {
      className,
      iconPlacement,
      onSearch,
      value: propValue,
      defaultValue,
      onChange,
      ...otherProps
    } = props;

    const originValue = 'defaultValue' in props ? defaultValue : propValue;
    const [value, setValue] = React.useState(originValue);

    const handleChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
      const val = get(e, 'target.value');
      setValue(val);
      if (isFunction(onChange)) {
        onChange(e);
      }
    };

    const handleSearch = () => {
      if (isFunction(onSearch)) {
        onSearch(value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentKeyCode = get(e, 'keyCode');
      if (currentKeyCode === 13 && isFunction(onSearch)) {
        onSearch(value);
      }
    };

    const searchIcon = (
      <div className={classes.searchIcon} onClick={handleSearch}>
        {/** TODO 待更换搜索图标，skecth上的抠不下来 */}
        搜索
      </div>
    );

    return (
      <Input
        className={uniteClassNames(classes.root, className)}
        startElement={iconPlacement === IconPlacement.START ? searchIcon : null}
        endElement={iconPlacement === IconPlacement.END ? searchIcon : null}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...otherProps}
        ref={ref}
      />
    );
  },
);

SearchInput.defaultProps = {
  iconPlacement: 'end',
};
export default SearchInput;
