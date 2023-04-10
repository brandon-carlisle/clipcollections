import { type GetStaticPropsContext } from 'next';

import Layout from '@components/Layout';

export default function Collection() {
  return (
    <Layout>
      <div className="mb-20 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <h1 className="text-4xl font-semibold text-zinc-300">
          Collection name
        </h1>
      </div>
    </Layout>
  );
}

export function getStaticProps(ctx: GetStaticPropsContext) {
  console.log(ctx.params);

  return {
    props: {},
  };
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: false,
  };
}
