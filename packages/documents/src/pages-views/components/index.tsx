import * as React from 'react';
import camelCase from 'lodash/camelCase';
import { TMDXHub } from '~docs/core/MdxHub';
import Layout from './views/Layout';
import MdxPage from './views/Mdxpage';

interface Props {
  mdxHub: TMDXHub[];
  tab: string;
  comName: string;
}

const Components: React.FC<Props> = (props: Props) => {
  const { mdxHub, tab, comName } = props;
  let hub = mdxHub[0];

  if (comName) {
    hub = mdxHub.find((h) => camelCase(h.tagName) === comName) || hub;
  }
  const MdxCom = tab === 'design' ? hub.designMdx : hub.codeMdx;

  return (
    <Layout mdxHub={mdxHub} comName={comName}>
      <MdxPage
        mdxHub={hub}
        tab={['code', 'design'].includes(tab) ? (tab as 'code' | 'design') : 'code'}
      >
        {MdxCom ? <MdxCom /> : null}
      </MdxPage>
    </Layout>
  );
};

export default Components;
