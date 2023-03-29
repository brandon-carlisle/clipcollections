import { getServerAuthSession } from "@server/auth";
import { type GetServerSidePropsContext } from "next";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";

interface ProfileProps {
  userSession: Session;
}

export default function Profile({ userSession: session }: ProfileProps) {
  if (!session) return <p>Not found...</p>;

  return (
    <main className="mx-auto w-full p-4 md:max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-zinc-300">
          {session.user.name}&apos;s collections
        </h1>
        <button onClick={() => void signOut()}>Sign Out</button>
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
