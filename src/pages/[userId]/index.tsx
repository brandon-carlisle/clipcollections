import Button from "@components/Button";
import { getServerAuthSession } from "@server/auth";
import { type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import { type FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ProfileProps {
  userSession: Session;
}

export default function Profile({ userSession: session }: ProfileProps) {
  const [inputs, setInputs] = useState([
    { title: "Title", url: "Clip URL", key: uuidv4() },
  ]);

  if (!session) return <p>Not found...</p>;

  const handleAddMore = () => {
    console.log("Clicked");

    setInputs((prev) => [
      ...prev,
      { title: "Title", url: "Clip URL", key: uuidv4() },
    ]);
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

        <form onSubmit={(e) => handleFormSubmit(e)}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm">
              Collection name
            </label>
            <input
              type="text"
              id="name"
              className="px-4 py-2 text-zinc-900"
              required
            />

            <label htmlFor="">Clips</label>
            {inputs.map((input) => {
              // TODO: Fix key here
              return (
                <div key={input.key} className="flex justify-between gap-3">
                  <input
                    type="text"
                    id="title"
                    className="w-full px-4 py-2 text-zinc-900"
                    placeholder={input.title}
                    required
                  />
                  <input
                    type="url"
                    id="url"
                    className="w-full px-4 py-2 text-zinc-900"
                    placeholder={input.url}
                    required
                  />
                </div>
              );
            })}

            <Button
              clickHandler={handleAddMore}
              content="Add more"
              type="button"
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
