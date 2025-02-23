'use client'
import Link from "next/link"
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    { name: 'Home', href: '/'},
    { name: 'Dashboard', href: '/dashboard'},
];
export default function NavLinks(){
    const pathname = usePathname();

    return(
        <ul className="flex flex-row gap-8">
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
        </ul>
    )
}