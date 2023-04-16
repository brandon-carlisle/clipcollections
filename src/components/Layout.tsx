import { signIn, signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { type ReactNode } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';
import { Button } from './ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/DropdownMenu';
import { Separator } from './ui/Seperator';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className="mx-auto h-full w-full p-4 md:max-w-2xl">{children}</main>
    </>
  );
}

function Navbar() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';

  const isAuthedAndHasProfile =
    !!session && !!session.user?.name && !!session.user.image && !isLoading;

  return (
    <nav className="mb-10">
      <div className="mx-auto flex items-center justify-between py-6 px-3 md:max-w-7xl">
        <Link className="text-xl font-bold" href="/">
          ClipCollections
        </Link>

        {isAuthedAndHasProfile && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                {isAuthedAndHasProfile && (
                  <AvatarImage src={session.user.image || undefined} />
                )}
                <AvatarFallback>CC</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <Link href={`/${session.user.name || '/'}`}>
                <DropdownMenuItem className="hover:cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => void signOut()}
                className="hover:cursor-pointer"
              >
                Logout
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>About</DropdownMenuLabel>
              <a
                href="https://github.com/brandon-carlisle/clipcollections"
                target="_blank"
              >
                <DropdownMenuItem className="hover:cursor-pointer">
                  Github
                </DropdownMenuItem>
              </a>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!isLoading && !isAuthedAndHasProfile && (
          <Button onClick={() => void signIn('twitch')}>Sign in</Button>
        )}

        {isLoading && <Button disabled>Sign in</Button>}
      </div>
      <Separator />
    </nav>
  );
}
