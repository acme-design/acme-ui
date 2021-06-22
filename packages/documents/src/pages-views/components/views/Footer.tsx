import React from 'react';
import camelCase from 'lodash/camelCase';
import Link from 'next/link';
import { TMDXHub } from '~docs/core/MdxHub';
import FooterLess from '../styles/footer.module.less';

interface FooterProps {
  mdxHub: TMDXHub[];
  activeComName: string;
}

class Footer extends React.PureComponent<FooterProps> {
  render(): React.ReactNode {
    const { mdxHub, activeComName } = this.props;
    const currentIdx = mdxHub.findIndex((hub) => activeComName === camelCase(hub.tagName));
    const prev = currentIdx > 0 ? mdxHub[currentIdx - 1] : null;
    const next = currentIdx < mdxHub.length - 1 ? mdxHub[currentIdx + 1] : null;

    return (
      <div className={FooterLess.container}>
        <div className={FooterLess.centerContent}>
          <div className={FooterLess.centerInner}>
            {prev ? (
              <Link href={prev.path}>
                <a className={FooterLess.link}>
                  <span>{prev.tagName}</span>
                  <span>{prev.name}</span>
                </a>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={next.path}>
                <a className={FooterLess.link}>
                  <span>{next.tagName}</span>
                  <span>{next.name}</span>
                </a>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
