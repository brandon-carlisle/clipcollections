import { api } from '@utils/api';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

import Button from '@components/Button';
import Layout from '@components/Layout';

export default function Profile() {
  // TODO: get user by username here

  const router = useRouter();

  console.log(router.query);

  const { data } = api.profile.getUserByUsername.useQuery(router.query);

  return (
    <Layout>
      <div className="mb-20 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <h1 className="text-4xl font-semibold text-zinc-300">
          {'username'}&apos;s collections
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
