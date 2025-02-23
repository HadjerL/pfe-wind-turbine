import Link from "next/link";
import NavLinks from "./nav-links";

export default function NavBar(){
    return (
        <nav className="flex flex-row justify-between py-8 px-20 shadow-sm">
        <Link
            href={"/"}
        >
            Logo
        </Link>
        <NavLinks/>
        </nav>
    )
}