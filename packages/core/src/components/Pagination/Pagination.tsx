import * as React from 'react';
import get from 'lodash/get';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import omit from 'lodash/omit';
import { getPages, IPageItem, PageItemType } from './util/Pagination';
import Arrow from './Arrow';
import DoubleArrow from './DoubleArrow';
import Input from '../Input';
import Select from './Select';
import './style/pagination.less';
import { uniteClassNames } from '../../utils/tools';

const classNamePrefix = 'acme-pagination';

export const classes = {
  root: classNamePrefix,
  text: `${classNamePrefix}-text`,
  pageContent: `${classNamePrefix}-content`,
  pageItem: `${classNamePrefix}-item`,
  dotGroup: `${classNamePrefix}-dot-group`,
  doubleArrow: `${classNamePrefix}-double-arrow`,
  leftDoubleArrow: `${classNamePrefix}-left-double-arrow`,
  rightDoubleArrow: `${classNamePrefix}-right-double-arrow`,
  jumpBase: `${classNamePrefix}-jump-base-input`,
  jumpInput: (type: PaginationProps['type']) => `${classNamePrefix}-jump-${type}-input`,
  default: {
    item: `${classNamePrefix}-default-item`,
    active: `${classNamePrefix}-default-item-active`,
    disabled: `${classNamePrefix}-default-item-disabled`,
    more: `${classNamePrefix}-default-item-more`,
    arrow: `${classNamePrefix}-default-arrow`,
    leftBtn: `${classNamePrefix}-default-left-button`,
    rightBtn: `${classNamePrefix}-default-right-button`,
    arrowDisabled: `${classNamePrefix}-default-arrow-disabled`,
    dot: `${classNamePrefix}-default-dot`,
    total: `${classNamePrefix}-default-total`,
  },
  mini: {
    item: `${classNamePrefix}-mini-item`,
    active: `${classNamePrefix}-mini-item-active`,
    disabled: `${classNamePrefix}-mini-item-disabled`,
    more: `${classNamePrefix}-mini-item-more`,
    arrow: `${classNamePrefix}-mini-arrow`,
    leftBtn: `${classNamePrefix}-mini-left-button`,
    rightBtn: `${classNamePrefix}-mini-right-button`,
    arrowDisabled: `${classNamePrefix}-mini-arrow-disabled`,
    dot: `${classNamePrefix}-mini-dot`,
    total: `${classNamePrefix}-mini-total`,
  },
  simple: {
    item: `${classNamePrefix}-simple-item`,
    active: `${classNamePrefix}-simple-active`,
    disabled: `${classNamePrefix}-simple-item-disabled`,
    container: `${classNamePrefix}-simple-container`,
    text: `${classNamePrefix}-simple-text`,
    arrow: `${classNamePrefix}-simple-arrow`,
    leftBtn: `${classNamePrefix}-simple-left-button`,
    rightBtn: `${classNamePrefix}-simple-right-button`,
    arrowDisabled: `${classNamePrefix}-simple-arrow-disabled`,
  },
};

// ??????????????????????????????????????? PAGE_ITEM_SIZE ?????????
const PAGE_ITEM_SIZE = 7;
enum PaginationType {
  DEFAULT = 'default',
  MINI = 'mini',
  SIMPLE = 'simple',
}

type TPaginationType = `${PaginationType}`;

export interface PaginationProps {
  /**
   *  ??????????????????
   * @default default
   *  */
  type: TPaginationType;
  /**
   * ??????
   * @default 0
   * */
  total: number;
  /**
   * ???????????? ??????
   * @default false
   * */
  showTotal?: boolean;
  /**
   * ?????????
   * */
  current?: number;
  /**
   * ??????????????????
   * @default 1
   * */
  defaultCurrent: number;
  /**
   * ???????????????
   * */
  pageSize?: number;
  /**
   * ????????????????????????
   * @default 10
   */
  defaultPageSize: number;
  /**
   * ???????????????????????????
   * @default [10, 20, 50, 100]
   * */
  pageSizeOptions: number[];
  /** page ???????????? */
  onChange?: (page: number) => void;
  /**
   * ???????????? pageSize ?????????
   * @default false
   * */
  showPageSize?: boolean;
  /** ?????? pageSize */
  onPageSizeChange?: (pageSize: number) => void;
  /**
   * ????????????????????????
   * @default false
   * */
  showJump?: boolean;
  /** ?????????????????? className */
  className?: string;
}

interface PaginationState {
  totalPage: number;
  jumpPage: string;
  currPage: number;
  currSize: number;
}

class Pagination extends React.PureComponent<PaginationProps, PaginationState> {
  static defaultProps = {
    type: 'default',
    total: 0,
    pageSizeOptions: [10, 20, 50, 100],
    defaultCurrent: 1,
    defaultPageSize: 10,
  };

  constructor(props: PaginationProps) {
    super(props);
    const { total, pageSize, defaultCurrent, current, defaultPageSize } = props;
    const totalPage = Math.ceil(total / (pageSize || defaultPageSize));
    this.state = {
      totalPage,
      jumpPage: '',
      currPage: current || defaultCurrent,
      currSize: pageSize || defaultPageSize,
    };
  }

  componentDidMount(): void {
    const { current, onChange, pageSize, onPageSizeChange } = this.props;
    if (current && !onChange) {
      console.warn(
        `The component is currently a controlled component. Current should be modified using onChange props`,
      );
    }
    if (pageSize && !onPageSizeChange) {
      console.warn(
        `The component is currently a controlled component. pageSize should be modified using onPageSizeChange props`,
      );
    }
  }

  componentDidUpdate(prevProps: PaginationProps): void {
    const { total, current, pageSize } = this.props;
    if (total !== get(prevProps, 'total')) {
      this.updateTotalPage();
    }
    if (current !== get(prevProps, 'current')) {
      this.updateDefaultPage();
    }
    if (pageSize !== get(prevProps, 'pageSize')) {
      this.updateDefaultSize();
    }
  }

  private updateDefaultSize = () => {
    const { pageSize } = this.props;
    const size = Number(pageSize);
    if (pageSize && isNumber(size)) {
      this.setState(
        {
          currSize: size,
        },
        this.updateTotalPage,
      );
    } else {
      console.error(pageSize, `pageSize value is not number ${isNumber(pageSize)}`);
    }
  };

  private updateDefaultPage = () => {
    const { current } = this.props;
    const page = Number(current);
    if (current && isNumber(page)) {
      this.setState({
        currPage: page,
      });
    } else {
      console.error(current, `current value is not number`);
    }
  };

  private updateTotalPage = () => {
    const { total } = this.props;
    const { currPage, currSize } = this.state;
    const totalPage = Math.ceil(total / currSize);
    const newCurrent = currPage > totalPage ? totalPage : currPage;
    this.setState({
      totalPage,
    });
    this.pageChange(newCurrent);
  };

  private decreasePage = () => {
    const { currPage } = this.state;
    if (currPage <= 1) return;
    const page = currPage - 1;
    this.pageChange(page);
  };

  private increasePage = () => {
    const { currPage } = this.state;
    const { totalPage } = this.state;
    if (currPage >= totalPage) return;
    const page = currPage + 1;
    this.pageChange(page);
  };

  private pageChange = (page: number) => {
    const { onChange, current } = this.props;
    if (!current) {
      this.setState({
        currPage: page,
      });
    }
    if (isFunction(onChange)) {
      onChange(page);
    }
  };

  private stepPage = (type: string) => {
    const { currPage } = this.state;
    const page = type === PageItemType.LEFT_MORE ? currPage - 3 : currPage + 3;
    this.pageChange(page);
  };

  private jumpInputChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
    const value = get(e, 'target.value');
    this.setState({
      jumpPage: value,
    });
  };

  private quickJumpPage = () => {
    const { totalPage, jumpPage } = this.state;
    const value = Number(jumpPage);
    if (isNumber(value) && value > 0 && value <= totalPage) {
      this.pageChange(value);
    }
    this.setState({
      jumpPage: '',
    });
  };

  private quickJumpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const keyCode = get(e, 'keyCode');
    if (keyCode === 13) {
      this.quickJumpPage();
    }
  };

  private pageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>, value: number) => {
    const { onPageSizeChange, pageSize } = this.props;
    const size: number = value;
    if (!pageSize) {
      this.setState(
        {
          currSize: size,
        },
        this.updateTotalPage,
      );
    }
    if (isFunction(onPageSizeChange)) {
      onPageSizeChange(value);
    }
  };

  private renderTotal = (type: PaginationType.MINI | PaginationType.DEFAULT): React.ReactNode => {
    const { total } = this.props;
    const totalClassNames = classes[type];
    return (
      <li className={uniteClassNames(classes.pageItem, totalClassNames.total)}>
        <span className={classes.text}>???{total}???</span>
      </li>
    );
  };

  private renderSizeOptions = (): React.ReactNode => {
    const { pageSizeOptions } = this.props;
    const { currSize } = this.state;
    const selectOptions = pageSizeOptions.map((item: number) => ({
      label: `${item}???/???`,
      value: item,
    }));
    return (
      <li className={classes.pageItem}>
        <Select value={currSize} options={selectOptions} onChange={this.pageSizeChange} />
      </li>
    );
  };

  private renderJumpBtn = (): React.ReactNode => {
    const { jumpPage } = this.state;
    const { type } = this.props;
    return (
      <li className={classes.pageItem}>
        <div>
          ??????
          <Input
            value={jumpPage}
            onBlur={this.quickJumpPage}
            onKeyDown={this.quickJumpKeyDown}
            className={uniteClassNames(classes.jumpBase, classes.jumpInput(type))}
            onChange={this.jumpInputChange}
            size={type === PaginationType.DEFAULT ? 'default' : 'small'}
          />
          ???
        </div>
      </li>
    );
  };

  private renderLeftArrow = (type: PaginationType): React.ReactNode => {
    const { currPage } = this.state;
    const contentClasses = classes[type];
    return (
      <div
        className={uniteClassNames(
          contentClasses.item,
          currPage <= 1 ? contentClasses.disabled : '',
        )}
        onClick={this.decreasePage}
      >
        <Arrow
          className={uniteClassNames(
            contentClasses.arrow,
            contentClasses.leftBtn,
            currPage <= 1 ? contentClasses.arrowDisabled : '',
          )}
        />
      </div>
    );
  };

  private renderRightArrow = (type: PaginationType): React.ReactNode => {
    const { totalPage, currPage } = this.state;
    const contentClasses = classes[type];
    return (
      <div
        className={uniteClassNames(
          contentClasses.item,
          currPage >= totalPage ? contentClasses.disabled : '',
        )}
        onClick={this.increasePage}
      >
        <Arrow
          className={uniteClassNames(
            contentClasses.arrow,
            contentClasses.rightBtn,
            currPage >= totalPage ? contentClasses.arrowDisabled : '',
          )}
        />
      </div>
    );
  };

  private renderContent = (type: PaginationType.MINI | PaginationType.DEFAULT): React.ReactNode => {
    const { totalPage, currPage } = this.state;
    const contentClasses = classes[type];
    const paginationItems = getPages(totalPage, currPage, PAGE_ITEM_SIZE);
    return (
      <>
        <li className={classes.pageItem}>{this.renderLeftArrow(type)}</li>
        {paginationItems.map((item: IPageItem, index: number) => {
          const key = `acme-page-item-${index}`;
          return (
            <li className={classes.pageItem} key={key}>
              {item.type === PageItemType.PAGE ? (
                <div
                  className={uniteClassNames(
                    contentClasses.item,
                    item.val === currPage ? contentClasses.active : '',
                  )}
                  onClick={() => this.pageChange(item.val as number)}
                >
                  {item.val}
                </div>
              ) : (
                <div className={uniteClassNames(contentClasses.item, contentClasses.more)}>
                  <span className={classes.dotGroup}>
                    <span className={contentClasses.dot} />
                    <span className={contentClasses.dot} />
                    <span className={contentClasses.dot} />
                  </span>
                  <div className={classes.doubleArrow} onClick={() => this.stepPage(item.type)}>
                    <DoubleArrow
                      className={
                        item.type === PageItemType.LEFT_MORE
                          ? classes.leftDoubleArrow
                          : classes.rightDoubleArrow
                      }
                    />
                  </div>
                </div>
              )}
            </li>
          );
        })}
        <li className={classes.pageItem}>{this.renderRightArrow(type)}</li>
      </>
    );
  };

  private renderDefault = (type: PaginationType.MINI | PaginationType.DEFAULT): React.ReactNode => {
    const { showPageSize, showTotal, showJump } = this.props;
    return (
      <ul className={classes.pageContent}>
        {showTotal ? this.renderTotal(type) : null}
        {this.renderContent(type)}
        {showPageSize ? this.renderSizeOptions() : null}
        {showJump ? this.renderJumpBtn() : null}
      </ul>
    );
  };

  private renderSimple = (): React.ReactNode => {
    const { totalPage, currPage } = this.state;
    return (
      <>
        <div className={uniteClassNames(classes.pageItem, classes.simple.item)}>
          {this.renderLeftArrow(PaginationType.SIMPLE)}
        </div>
        <span className={classes.simple.container}>
          <span className={uniteClassNames(classes.simple.text, classes.simple.active)}>
            {currPage}
          </span>
          /<span className={classes.simple.text}>{totalPage}</span>
        </span>
        <div className={uniteClassNames(classes.pageItem, classes.simple.item)}>
          {this.renderRightArrow(PaginationType.SIMPLE)}
        </div>
      </>
    );
  };

  private renderPagination = (): React.ReactNode => {
    const { type } = this.props;
    switch (type) {
      case 'default':
        return this.renderDefault(PaginationType.DEFAULT);
      case 'mini':
        return this.renderDefault(PaginationType.MINI);
      case 'simple':
        return this.renderSimple();
      default:
        return null;
    }
  };

  public render(): React.ReactNode {
    const { className } = this.props;
    const otherProps = omit(this.props, [
      'className',
      'type',
      'total',
      'showTotal',
      'current',
      'defaultCurrent',
      'pageSize',
      'defaultPageSize',
      'pageSizeOptions',
      'onChange',
      'showPageSize',
      'onPageSizeChange',
      'showJump',
    ]);
    return (
      <div className={uniteClassNames(classes.root, className)} {...otherProps}>
        {this.renderPagination()}
      </div>
    );
  }
}

export default Pagination;
