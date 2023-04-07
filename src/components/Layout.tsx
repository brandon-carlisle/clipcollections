import { type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <main className="mx-auto w-full p-4 md:max-w-2xl">{children}</main>;
}
