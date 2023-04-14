import { signIn, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { type ReactNode } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { Button } from './ui/Button';
import { Separator } from './ui/Seperator';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Clip Collections</title>
        <meta
          name="description"
          content="Generate your own Twitch clip collections to share with your chat"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="mx-auto h-full w-full p-4 md:max-w-2xl">{children}</main>
    </>
  );
}

function Navbar() {
  // const session = useSession();

  const { data: session, status } = useSession();

  const isLoading = status === 'loading';

  return (
    <nav className="mb-10 h-24">
      <div className="mx-auto flex items-center justify-between py-6 px-3 md:max-w-7xl">
        <Link className="text-xl font-bold" href="/">
          ClipCollections
        </Link>

        <Avatar>
          {!isLoading && status === 'authenticated' ? (
            <Link href={`/${session.user.name || '/'}`}>
              <AvatarImage
                src={session.user.image || undefined}
                alt="Profile picture"
              />
              <AvatarFallback>CC</AvatarFallback>
            </Link>
          ) : null}
        </Avatar>

        {!isLoading && status === 'unauthenticated' && (
          <Button onClick={() => void signIn('twitch')}>Sign in</Button>
        )}
      </div>
      <Separator />
    </nav>
  );
}
