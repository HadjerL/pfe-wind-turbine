'use client';

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';

export type LinkItem = {
  name: string;
  href: string;
};

export default function NavLinks({ links }: { links: LinkItem[] }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Redirect to login page
      router.push('/login');
      // Force refresh to ensure all auth state is cleared
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback client-side cookie deletion
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push('/login');
      window.location.reload();
    }
  };

  return (
    <ul className="flex md:flex-row gap-4 md:gap-8 text-sm items-center flex-col">
      {links.map((link) => (
        <li
          key={link.name}
          className={clsx(
            "border-b-2 border-transparent hover:border-primary duration-75",
            { "": link.href === pathname }
          )}
        >
          <Link href={link.href}>
            <p>{link.name}</p>
          </Link>
        </li>
      ))}

      <li>
        <button
          onClick={handleLogout}
          className="cursor-pointer border-2 hover:bg-white hover:border-primary hover:text-primary px-6 py-2 rounded-md font-semibold border-white bg-gray-400 text-white"
        >
          Logout
        </button>
      </li>
    </ul>
  );
}