import { type GetServerSidePropsContext } from 'next';
import { type Session } from 'next-auth';
import { signOut } from 'next-auth/react';

import { getServerAuthSession } from '@server/auth';

import Button from '@components/Button';
import Layout from '@components/Layout';

interface ProfileProps {
  userSession: Session;
}

export default function Profile({ userSession: session }: ProfileProps) {
  return (
    <Layout>
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
    </Layout>
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

  return {
    props: { userSession: session },
  };
}
