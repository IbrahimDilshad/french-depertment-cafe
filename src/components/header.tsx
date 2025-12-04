
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu as MenuIcon, ShoppingCart } from 'lucide-react';
import Logo from './logo';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';

const routes = [
  { href: '/', label: 'Menu' },
  { href: '/pre-order', label: 'Pre-order' },
  { href: '/admin', label: 'Management' },
];

export default function Header() {
  const { totalItems } = useCart();

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

          <div className="flex items-center ml-4 space-x-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/cart" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center rounded-full p-0 text-xs">
                            {totalItems}
                        </Badge>
                    )}
                    <span className="sr-only">View Cart</span>
                </Link>
            </Button>
            <div className="md:hidden">
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
      </div>
    </header>
  );
}
