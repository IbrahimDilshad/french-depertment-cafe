
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu as MenuIcon } from 'lucide-react';
import Logo from './logo';

const routes = [
  { href: '/', label: 'Menu' },
  { href: '/pre-order', label: 'Pre-order' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Logo />
        </Link>
        <div className="flex items-center">
          <nav className="hidden md:flex md:items-center md:space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="transition-colors hover:text-primary"
              >
                {route.label}
              </Link>
            ))}
          </nav>

          <div className="md:hidden ml-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-6 w-6" />
                  <span className="sr-only">Open navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col h-full py-6">
                  <div className="px-4 mb-8">
                     <Logo />
                  </div>
                  <nav className="flex flex-col items-start space-y-4 px-4 text-lg font-medium">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className="transition-colors hover:text-primary"
                      >
                        {route.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
