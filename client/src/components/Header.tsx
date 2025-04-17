import { Link } from "wouter";
import { Monitor } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center cursor-pointer">
              <Monitor className="h-8 w-8 mr-2 text-primary" />
              SEO Meta Tag Analyzer
            </h1>
          </Link>
          <div>
            <a href="#" className="text-primary hover:text-blue-700 font-medium">Docs</a>
            <a href="#" className="ml-4 text-primary hover:text-blue-700 font-medium">About</a>
          </div>
        </div>
      </div>
    </header>
  );
}
