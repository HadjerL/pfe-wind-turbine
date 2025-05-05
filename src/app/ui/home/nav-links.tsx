'use client'
import Link from "next/link"
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    { name: 'Home', href: '/' },
    { name: 'How It Works', href: '/#education' }, 
    { name: 'Insights', href: '/#showcase' },
    { name: 'Get Started', href: '/#cta' },
    // { name: 'Dashboard', href: '/dashboard' },
];

export default function NavLinks(){
    const pathname = usePathname();

    return(
        <ul className="flex md:flex-row gap-4 md:gap-8 text-sm items-center flex-col">
            {
                links.map((link) => {
                    return(
                        <li key={link.name}
                                className={ clsx(
                                    "border-b-2 border-transparent hover:border-primary duration-75",
                                    {
                                        "": link.href === pathname
                                    }
                                )
                                }
                        >
                            <Link 
                                href ={link.href}
                            >
                                <p>{link.name}</p>
                            </Link>
                        </li>
                    )
                })
            }
            <Link href='/dashboard' className="cursor-pointer bg-primary text-white px-6 py-2 rounded-md font-semibold">Dashboard</Link>
        </ul>
    )
}