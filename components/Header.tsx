import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">RePilot.ai</span>
          </Link>
          <p className="text-sm text-gray-600 hidden md:block">
            TESTING DASHBOARD
          </p>
        </div>
      </div>
    </header>
  );
}

