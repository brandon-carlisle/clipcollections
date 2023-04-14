import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

import { Button } from '@components/ui/Button';

export default function HomePage() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';

  return (
    <>
      <div className="mt-10 grid place-items-center">
        <header className="flex flex-col gap-8 text-center">
          <div>
            <h1 className="mb-3 text-5xl font-bold md:text-7xl">
              ClipCollections
            </h1>
            <p className="font-semibold text-zinc-400">
              Organise your Twitch clips into collections for easier chat
              commands
            </p>
          </div>

          <div className="flex justify-center">
            {!session && !isLoading && (
              <Button onClick={() => void signIn('twitch')}>Sign in</Button>
            )}

            {!session && isLoading && <Button disabled>Sign in</Button>}

            {session && !isLoading && session.user.name && (
              <Link href={`/create`}>
                <Button variant="default">Create collection</Button>
              </Link>
            )}
          </div>
        </header>
      </div>
    </>
  );
}
