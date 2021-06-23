import Head from 'next/head';
import HomeUI from '../pages-views/home';

export default function Home() {
  return (
    <>
      <Head>
        <title>Acme UI</title>
        <meta name="description" content="Next Gen UI Design Language and Library" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <HomeUI />
    </>
  );
}
