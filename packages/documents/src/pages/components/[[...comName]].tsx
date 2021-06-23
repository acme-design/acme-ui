import path from 'path';
import * as React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import MdxHub from '~docs/core/MdxHub';
import ComponentsUI from '../../pages-views/components';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { comName: string[] } }[] = [{ params: { comName: [''] } }];

  MdxHub.forEach((hub) => {
    if (!hub.path) return;
    const result = path.parse(hub.path || '');
    if (hub.codeMdx) paths.push({ params: { comName: [result.name] } });
    if (hub.designMdx) paths.push({ params: { comName: [result.name, 'design'] } });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context;
  const comName = params?.comName || [];

  return {
    props: {
      comName: comName[0] || '',
      tab: comName[1] || '',
    },
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const Components: React.FC<Props> = (props: Props) => {
  const { comName, tab } = props;
  const router = useRouter();
  React.useEffect(() => {
    if (!comName) {
      router.replace(MdxHub[0].path);
    }
  }, [comName]);
  return <ComponentsUI mdxHub={MdxHub} tab={tab} comName={comName} />;
};

export default Components;
