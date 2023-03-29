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
    <div>
      <h1 className="mb-16">User Page for: {session.user.name}</h1>
      <button onClick={() => void signOut()}>Sign Out</button>
    </div>
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
