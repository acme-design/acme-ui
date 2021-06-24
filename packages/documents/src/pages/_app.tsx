import './globals.less';
// eslint-disable-next-line import/no-unresolved
import '@acme-ui/core/styles/cover/index.less';
import type { AppProps } from 'next/app';
import { MDXProvider } from '@mdx-js/react';
import { Wrapper, Paragraph, headings, UL, OL, Code, Img } from '~controls';

const components = {
  ...headings,
  p: Paragraph,
  ol: OL,
  ul: UL,
  pre: Code,
  img: Img,
  wrapper: Wrapper,
};

// 顶级组件，所有 page 之间共享，用于全局样式，全局 state
const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <MDXProvider components={components}>
      <div id="document-scroll-container">
        <Component {...pageProps} />
      </div>
    </MDXProvider>
  );
};
export default MyApp;
