'use client'

import { IoCloseOutline } from "react-icons/io5";
import { IoMenu } from "react-icons/io5";
import NavLinks from "./nav-links";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLElement | null>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-row items-end justify-between py-4 px-20 shadow-sm shadow-black/20">
                <Link href={"/"}>
                    <Image
                        src={'/windpmslogo.svg'}
                        width={100}
                        height={100}
                        alt="logo"
                    />
                </Link>
                <NavLinks />
            </nav>

            {/* Mobile Navigation */}
            <nav
                className="relative flex md:hidden flex-row items-end justify-between py-4 px-4 shadow-sm shadow-black/20"
                ref={menuRef}
            >
                <Link href={"/"}>
                    <Image
                        src={'/windpmslogo.svg'}
                        width={100}
                        height={100}
                        alt="logo"
                    />
                </Link>
                {isMenuOpen ? (
                    <IoCloseOutline className="text-lg cursor-pointer" onClick={toggleMenu} />
                ) : (
                    <IoMenu className="text-lg cursor-pointer" onClick={toggleMenu} />
                )}
                {isMenuOpen && (
                    <div className="absolute top-16 border left-0 p-4 flex flex-col w-screen bg-white h-fit items-center justify-center">
                        <NavLinks />
                    </div>
                )}
            </nav>
        </div>
    );
}
