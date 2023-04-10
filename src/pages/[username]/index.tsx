import { api } from '@utils/api';
import {
  type GetServerSidePropsContext,
  type InferGetStaticPropsType,
} from 'next';
import Image from 'next/image';
import { type ParsedUrlQuery } from 'querystring';

import { generateSSGHelper } from '@server/helpers/generate';

import Layout from '@components/Layout';

export default function Profile(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  // No loading states for this because we prefetch in getStaticProps
  const { data, error } = api.profile.getByUsername.useQuery({
    username: props.username,
  });

  if (error) return <p>{error.message}</p>;

  if (!data) return <p>No user found</p>;

  return (
    <Layout>
      <header className="mb-16 flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-zinc-300">
          {data.name}&apos;s collections
        </h1>

        {data.image && data.name && (
          <Image
            src={data.image}
            alt={`${data.name}s profile image`}
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
      </header>

      <Collections userId={data.id} />
    </Layout>
  );
}

interface Params extends ParsedUrlQuery {
  username: string;
}

export async function getStaticProps(ctx: GetServerSidePropsContext) {
  const params = ctx.params as Params;

  const ssg = generateSSGHelper();

  await ssg.profile.getByUsername.prefetch({
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

function Collections({ userId }: { userId: string }) {
  const { data, isLoading, error } = api.collection.getAllByUserId.useQuery({
    userId,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  if (!data) return <p>No data available</p>;

  console.log(data);

  return (
    <div>
      {data.map((collection) => (
        <li key={collection.id}>{collection.name}</li>
      ))}
    </div>
  );
}
