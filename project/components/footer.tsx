import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-outer_space-500 text-platinum-500 dark:bg-outer_space-600 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-2xl font-bold">TaskFlow</h3>
            <p className="text-french_gray-400">
              The modern project management platform that helps teams
              collaborate and deliver results.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-french_gray-400 hover:text-platinum-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-french_gray-400 hover:text-platinum-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-french_gray-400 hover:text-platinum-500 transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-french_gray-400 hover:text-platinum-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-french_gray-400 hover:text-platinum-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-french_gray-400 hover:text-platinum-500 transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-french_gray-400 hover:text-platinum-500 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-french_gray-400 hover:text-platinum-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-french_gray-400 hover:text-platinum-500 transition-colors">
                  API Docs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-french_gray-400">
            © 2024 TaskFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
