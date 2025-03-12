import Link from "next/link";
import NavLinks from "./nav-links";
import Image from "next/image";

export default function NavBar(){
    return (
        <nav className="flex flex-row items-end justify-between py-4 px-20 shadow-sm shadow-black/20">
            <Link
                href={"/"}
            >
                <Image
                src={'windpmslogo.svg'}
                width={100}
                height={100}
                alt="logo"
                />
            </Link>
            <NavLinks/>
        </nav>
    )
}