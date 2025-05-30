"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from './components/WalletButton';
import Logo from './components/Logo';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className={`px-4 py-2 rounded-lg transition ${pathname === '/'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Calculator
          </Link>
          <Link
            href="/distributions"
            className={`px-4 py-2 rounded-lg transition ${pathname === '/distributions'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Distributions
          </Link>
          <Link
            href="/distribution"
            className={`px-4 py-2 rounded-lg transition ${pathname === '/distribution'
                ? 'bg-blue-500 text-white'
                : 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
              }`}
          >
            New Distribution
          </Link>
          <WalletButton />
        </div>
      </nav>
    </header>
  );
}
