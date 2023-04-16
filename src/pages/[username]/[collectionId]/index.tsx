import { api } from '@utils/api';
import { generateEmbedLink } from '@utils/embed';
import { Trash2 } from 'lucide-react';
import { type GetStaticPropsContext, type InferGetStaticPropsType } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type ParsedUrlQuery } from 'querystring';

import { generateSSGHelper } from '@server/helpers/generate';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@components/ui/AlertDialog';
import { Button } from '@components/ui/Button';

export default function Collection(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const { data: collection } = api.collection.getById.useQuery({
    collectionId: props.collectionId,
  });

  const session = useSession();
  const router = useRouter();

  if (!collection) return <p>Could not find that collection...</p>;
  if (collection.clips.length === 0) return <p>No clips found...</p>;

  const isAuthor = session.data?.user.id === collection.User?.id;

  const { mutate, status } = api.collection.remove.useMutation();

  if (status === 'loading') return <p>Loading...</p>;

  const handleRemoveCollection = () => mutate({ collectionId: collection.id });

  if (status === 'success')
    void router.push(`/${session.data?.user.name || '/'}`);

  return (
    <>
      <Head>
        <title>
          {collection.User?.name} | {collection.name}
        </title>
      </Head>
      <header className="mb-10 flex justify-between">
        <h1 className="text-4xl font-semibold text-zinc-300">
          {collection.User?.name && (
            <>
              <Link href={`/${collection.User.name}`}>
                {collection.User.name} &ndash;{' '}
              </Link>
              <span className="inline-block font-light">{collection.name}</span>
            </>
          )}
        </h1>

        {isAuthor && (
          <>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this collection from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRemoveCollection}>
                    <Trash2 />
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
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

  await ssg.collection.getById.prefetch({
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
