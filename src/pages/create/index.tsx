import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@utils/api';
import { type GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { type SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { getServerAuthSession } from '@server/auth';

import Layout from '@components/Layout';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';

export default function Create() {
  return (
    <Layout>
      <div>
        <h2 className="mb-5 text-3xl font-semibold">Add new collection</h2>
        <CreateCollectionForm />
      </div>
    </Layout>
  );
}

export const formSchema = z.object({
  collectionTitle: z
    .string()
    .min(1, { message: 'Title must contain at least 1 character(s)' })
    .max(12, { message: 'Title must contain at most 12 character(s)' }),
  clips: z
    .array(
      z.object({
        title: z
          .string()
          .min(1, {
            message: 'Clip title must contain at least 1 character(s)',
          })
          .max(12, {
            message: 'Clip title must contain at most 12 character(s)',
          }),
        url: z
          .string()
          .url({ message: 'Clip url must be a valid Twitch clip' })
          .includes('twitch.tv/', {
            message: 'Clip url must be a valid Twitch clip',
          }),
      }),
    )
    .min(1, { message: 'At least one clip needed' })
    .max(10, { message: 'Only ten clips allowed' }),
});

type FormData = z.infer<typeof formSchema>;

function CreateCollectionForm() {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { clips: [{ title: '', url: '' }] },
  });

  const { fields, remove, append } = useFieldArray({ name: 'clips', control });

  const router = useRouter();

  const {
    data,
    isLoading,
    mutate: createCollection,
    isSuccess,
  } = api.collection.create.useMutation();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    createCollection({
      collectionTitle: data.collectionTitle,
      clips: data.clips,
    });
  };

  if (isSuccess && data.username && data.collectionId)
    void router.push(`/${data.username}/${data.collectionId}`);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 flex w-full flex-col gap-1">
          <label htmlFor="name">Collection name</label>
          <Input
            type="text"
            className="px-4 py-2"
            placeholder="My first collection"
            {...register('collectionTitle')}
          />
          <p className="font-bold text-red-500">
            {errors.collectionTitle?.message}
          </p>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="mb-3 flex justify-between gap-3">
            <div className="flex w-full flex-col gap-1">
              <Input
                {...register(`clips.${index}.title`)}
                className="w-full px-4 py-2"
                placeholder="Clip title"
              />
            </div>
            <div className="flex w-full flex-col gap-1">
              <Input
                {...register(`clips.${index}.url`)}
                className="w-full px-4 py-2"
                placeholder="Clip URL"
              />
            </div>
            <button type="button" onClick={() => remove(index)}>
              🗑️
            </button>
          </div>
        ))}

        <div className="mb-3">
          <p className="font-bold text-red-500">
            {errors.clips && errors.clips[0]?.title?.message}
          </p>
          <p className="font-bold text-red-500">
            {errors.clips && errors.clips[0]?.url?.message}
          </p>
          <p className="font-bold text-red-500">{errors?.clips?.message}</p>
        </div>

        <div className="mb-4">
          <Button type="button" onClick={() => append({ title: '', url: '' })}>
            Add clip
          </Button>
        </div>

        <Button type="submit">Add collection</Button>
      </form>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  ctx;

  return {
    props: { userSession: session },
  };
}
