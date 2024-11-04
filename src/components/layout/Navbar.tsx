import Link from "next/link";

export default function Navbar() {
    return (
        <div className="flex items-center justify-between w-full px-6 py-4 bg-primary text-primary-foreground shadow-xl">
            <Link className="text-xl font-semibold hover:font-bold hover:text-cyan-400" href="/">
                Gruppe 2
            </Link>

            {/* Navigation Links */}
            <div className="flex space-x-6">
                <Link className="hover:text-cyan-400 hover:font-bold" href="/bill-of-materials">Bill of Materials</Link>
                <Link className="hover:text-cyan-400 hover:font-bold" href="/periods">Periods</Link>
            </div>
        </div>
    );
}