"use client";
import Link from "next/link";
import AuthButtons from "@/components/auth-buttons";

export default function Navbar() {
	return (
		<nav className="flex justify-between items-center py-4 px-6 fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-100 via-white to-pink-100 shadow-md">
			{/* Logo */}
			<Link href="/" className="text-2xl font-extrabold text-gray-800 hover:text-orange-600 transition-colors">
				hymn<span className="text-pink-500">.</span>
			</Link>

			{/* Auth Buttons */}
			<div>
				<AuthButtons />
			</div>
		</nav>
	);
}
