import Button from "@components/Button";
import { getServerAuthSession } from "@server/auth";
import { api } from "@utils/api";
import { type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";

import { useForm, useFieldArray } from "react-hook-form";

interface ProfileProps {
  userSession: Session;
}

interface FormValues {
  collectionTitle: string;
  clips: {
    title: string;
    url: string;
  }[];
}

export default function Profile({ userSession: session }: ProfileProps) {
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm<FormValues>({
    defaultValues: { collectionTitle: "", clips: [{ title: "", url: "" }] },
  });

  const { fields, remove, append } = useFieldArray({ name: "clips", control });

  const onSubmit = (data) => {
    console.log(data);
  };

  const onError = (errors) => {
    console.error(errors);
  };

  return (
    <main className="mx-auto w-full p-4 md:max-w-2xl">
      <div className="mb-20 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <h1 className="text-4xl font-semibold text-zinc-300">
          {session.user.name}&apos;s collections
        </h1>
        <Button
          clickHandler={() => void signOut()}
          content="Sign out"
          type="button"
        />
      </div>

      <div>
        <h2 className="mb-5 text-3xl font-semibold text-zinc-300">
          Add new collection
        </h2>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className="mb-5 flex w-full flex-col gap-1">
            <label htmlFor="name">Collection name</label>
            <input
              type="text"
              className="px-4 py-2 text-zinc-900"
              placeholder="My first collection"
              {...register("collectionTitle")}
            />
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="mb-3 flex justify-between gap-3">
              <div className="flex w-full flex-col gap-1">
                <input
                  {...register(`clips.${index}.title`)}
                  className="w-full px-4 py-2 text-zinc-900"
                  placeholder="Clip title"
                />
              </div>
              <div className="flex w-full flex-col gap-1">
                <input
                  {...register(`clips.${index}.url`)}
                  className="w-full px-4 py-2 text-zinc-900"
                  placeholder="Clip URL"
                />
              </div>
              <button type="button" onClick={() => remove(index)}>
                🗑️
              </button>
            </div>
          ))}

          <div className="mb-4">
            <Button
              // clickHandler={handleAddMore}
              content="Add more"
              type="button"
              clickHandler={() => append({ title: "", url: "" })}
            />
          </div>

          <Button content="Add collection" type="submit" />
        </form>
      </div>
    </main>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: { userSession: session },
  };
}
