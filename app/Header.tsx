"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from './components/WalletButton';
import Logo from './components/Logo';

export default function Header() {
  const pathname = usePathname();
  const isDistributionPage = pathname === '/distribution';

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href={isDistributionPage ? "/" : "/distribution"}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {isDistributionPage ? "Go to Calculator" : "Start Distribution"}
          </Link>
          <WalletButton />
        </div>
      </nav>
    </header>
  );
}
