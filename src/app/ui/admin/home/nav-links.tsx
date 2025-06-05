'use client';

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';

export type LinkItem = {
  name: string;
  href: string;
};

export default function NavLinks({
  links
}: {
  links: LinkItem[];
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');     
    router.push('/login');                
  };

  return (
    <ul className="flex md:flex-row gap-4 md:gap-8 text-sm items-center flex-col">
      {links.map((link) => (
        <li
          key={link.name}
          className={clsx(
            "border-b-2 border-transparent hover:border-primary duration-75",
            {
              "": link.href === pathname,
            }
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
