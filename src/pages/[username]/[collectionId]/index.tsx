import { api } from '@utils/api';
import { generateEmbedLink } from '@utils/embed';
import { type GetStaticPropsContext, type InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { type ParsedUrlQuery } from 'querystring';

import { generateSSGHelper } from '@server/helpers/generate';

export default function Collection(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { data: collection } = api.collection.getByCollectionId.useQuery({
    collectionId: props.collectionId,
  });

  if (!collection) return <p>Could not find that collection...</p>;

  return (
    <>
      <header className="mb-10">
        <h1 className="text-4xl font-semibold text-zinc-300">
          {collection.name}{' '}
          {collection.User?.name && (
            <>
              &ndash;{' '}
              <Link
                className="inline-block font-light"
                href={`/${collection.User.name}`}
              >
                {collection.User.name}
              </Link>
            </>
          )}
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-10">
        {collection.clips.map((clip) => {
          return (
            <div key={clip.id}>
              <div className="mb-3">{clip.title}</div>
              <iframe
                src={generateEmbedLink(clip.url)}
                height="400"
                width="100%"
              ></iframe>
            </div>
          );
        })}
      </div>
    </>
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
