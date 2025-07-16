import Head from 'next/head';
import BibleApp from '../components/BibleApp';

export default function Home() {
  return (
    <>
      <Head>
        <title>ASV Bible Study</title>
        <meta name="description" content="Voice-powered ASV Bible app with notes and AI insights" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="bg-white dark:bg-gray-900 min-h-screen">
        <BibleApp />
      </main>
    </>
  );
}
