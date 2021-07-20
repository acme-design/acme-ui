import * as React from 'react';
import get from 'lodash/get';
import set from 'lodash/set';
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
  onSearch?: (value?: InputProps['value']) => void;
}

const classNamePrefix = 'acme-search-input';

export const classes = {
  root: classNamePrefix,
  searchIcon: `${classNamePrefix}-search-icon`,
};

const SearchInput = React.forwardRef(
  (props: SearchInputProps, ref: React.ForwardedRef<HTMLInputElement>) => {
    const { className, iconPlacement, onSearch, ...otherProps } = props;

    const innerRef = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
      if (!ref) return;

      const refCurrent = get(innerRef, 'current');
      if (typeof ref === 'function') {
        ref(refCurrent);
      } else {
        set(ref, 'current', refCurrent);
      }
    });

    const handleSearch = () => {
      if (isFunction(onSearch)) {
        const currentValue = get(innerRef, 'current.value');
        onSearch(currentValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const currentKeyCode = get(e, 'keyCode');
      if (currentKeyCode === 13 && isFunction(onSearch)) {
        const currentValue = get(innerRef, 'current.value');
        onSearch(currentValue);
      }
    };

    const searchIcon = (
      <div className={classes.searchIcon} onClick={handleSearch} data-testid={classes.searchIcon}>
        {/** TODO 待更换搜索图标，skecth上的抠不下来 */}
        搜索
      </div>
    );

    return (
      <Input
        className={uniteClassNames(classes.root, className)}
        startElement={iconPlacement === IconPlacement.START ? searchIcon : null}
        endElement={iconPlacement === IconPlacement.END ? searchIcon : null}
        onKeyDown={handleKeyDown}
        {...otherProps}
        ref={innerRef}
      />
    );
  },
);

SearchInput.defaultProps = {
  iconPlacement: 'end',
};
export default SearchInput;
