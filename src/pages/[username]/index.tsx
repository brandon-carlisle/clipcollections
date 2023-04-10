import { api } from '@utils/api';
import { signOut } from 'next-auth/react';

import Button from '@components/Button';
import Layout from '@components/Layout';

export default function Profile() {
  // TODO: get user by username here

  const { data, isLoading, error } = api.profile.getUserByUsername.useQuery({
    username: 'beanzmate',
  });

  console.log(data);

  if (error) return <p>{error.message}</p>;

  if (isLoading) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="mb-20 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <h1 className="text-4xl font-semibold text-zinc-300">
          {data?.name}&apos;s collections
        </h1>

        {data.image && data.name && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.image} alt={`${data.name}s profile image`} />
        )}
        <Button
          clickHandler={() => void signOut()}
          content="Sign out"
          type="button"
        />
      </div>
    </Layout>
  );
}

// interface Params extends ParsedUrlQuery {
//   username: string;
// }

// export function getStaticProps(ctx: GetServerSidePropsContext) {
//   const params = ctx.params as Params;

//   const user = api.profile.getUserByUsername.useQuery({
//     username: params.username,
//   });

//   console.log(user);

//   return {
//     props: {},
//   };
// }
