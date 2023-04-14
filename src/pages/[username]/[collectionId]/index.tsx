import { api } from '@utils/api';
import { type GetStaticPropsContext, type InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { type ParsedUrlQuery } from 'querystring';

import { generateSSGHelper } from '@server/helpers/generate';

export default function Collection(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { data } = api.collection.getByCollectionId.useQuery({
    collectionId: props.collectionId,
  });

  return (
    <div className="mb-20 flex flex-col justify-between gap-2 md:flex-row md:items-center">
      <div className="flex w-full flex-col gap-1">
        <h1 className="text-4xl font-semibold text-zinc-300">
          {data?.name}{' '}
          {data?.User?.name && (
            <>
              &ndash;{' '}
              <Link
                className="inline-block font-light"
                href={`/${data?.User?.name}`}
              >
                {data?.User?.name}
              </Link>
            </>
          )}
        </h1>
      </div>
    </div>
  );
}

interface Params extends ParsedUrlQuery {
  collectionId: string;
}

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const params = ctx.params as Params;

  const ssg = generateSSGHelper();

  await ssg.collection.getByCollectionId.prefetch({
    collectionId: params.collectionId,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      collectionId: params.collectionId,
    },
  };
}

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking' };
};
