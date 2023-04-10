import { api } from '@utils/api';
import {
  type GetServerSidePropsContext,
  type InferGetStaticPropsType,
} from 'next';
import { signOut } from 'next-auth/react';
import { type ParsedUrlQuery } from 'querystring';

import { generateSSGHelper } from '@server/helpers/generate';

import Button from '@components/Button';
import Layout from '@components/Layout';

export default function Profile(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  console.log('Props: ', props);

  const { data, error } = api.profile.getUserByUsername.useQuery({
    username: props.username,
  });

  if (error) return <p>{error.message}</p>;

  if (!data) return <p>No user found</p>;

  return (
    <Layout>
      <div className="mb-20 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <h1 className="text-4xl font-semibold text-zinc-300">
          {data.name}&apos;s collections
        </h1>

        {data.image && data.name && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.image} alt={`${data.name}s profile image`} />
        )}
        <Button
          clickHandler={() => void signOut()}
          content="Sign out"
          type="button"
        />
      </div>
    </Layout>
  );
}

interface Params extends ParsedUrlQuery {
  username: string;
}

export async function getStaticProps(ctx: GetServerSidePropsContext) {
  const params = ctx.params as Params;

  const ssg = generateSSGHelper();

  await ssg.profile.getUserByUsername.prefetch({
    username: params.username,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username: params.username,
    },
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};
