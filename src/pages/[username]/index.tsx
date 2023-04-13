import { api } from '@utils/api';
import {
  type GetServerSidePropsContext,
  type InferGetStaticPropsType,
} from 'next';
import Image from 'next/image';
import Link from 'next/link';
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
      <header className="mb-16 flex items-start justify-between">
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

interface CollectionsProps {
  userId: string;
}

function Collections({ userId }: CollectionsProps) {
  const { data, isLoading, error } = api.collection.getAllByUserId.useQuery({
    userId,
  });

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>{error.message}</p>;

  if (!data) return <p>No data available</p>;

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {data.map((collection) => {
        if (!collection.User?.name) return <p>Could not find user...</p>;

        return (
          <li key={collection.id}>
            <Link
              className="block rounded-lg bg-slate-800 px-4 py-8"
              href={`/${collection.User.name}/${collection.id}`}
            >
              {collection.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
