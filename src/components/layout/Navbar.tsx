import Link from "next/link";

export default function Navbar() {
    return (
        <div className="flex items-center justify-between w-full px-6 py-4 bg-gray-800 text-white shadow-md">
            <Link className="text-xl font-semibold" href="/">
                Gruppe 2
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-6">
                <Link className="hover:text-gray-400" href="/bill-of-materials">Bill of Materials</Link>
                <Link className="hover:text-gray-400" href="/periods">Periods</Link>
            </div>
        </div>
    );
}