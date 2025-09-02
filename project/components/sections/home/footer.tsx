import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white shadow-sm dark:bg-neutral-900">
      <div className="container py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            className="mb-2 flex items-center space-x-3 sm:mb-0">
            <Image
              width={30}
              height={30}
              src="/assets/images/logo.svg"
              className="svg-primary dark:svg-white"
              alt="Fluid Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Fluid
            </span>
          </Link>

          <ul className="mb-2 flex flex-wrap items-center text-sm font-medium text-neutral-500 sm:mb-0 dark:text-neutral-400">
            <li>
              <a
                href="https://stratpoint.com/about-us"
                className="me-4 hover:underline md:me-6">
                About
              </a>
            </li>
            <li>
              <a
                href="https://stratpoint.com/contact-us"
                className="me-4 hover:underline md:me-6">
                Contact Us
              </a>
            </li>
            <li>
              <a
                href="https://stratpoint.com/privacy-notice"
                className="me-4 hover:underline md:me-6">
                Privacy Notice
              </a>
            </li>
            <li>
              <a
                href="https://stratpoint.com/security-disclosure-policy"
                className="hover:underline">
                Security Policy
              </a>
            </li>
          </ul>
        </div>

        <hr className="my-4 border-neutral-200 sm:mx-auto lg:my-6 dark:border-neutral-700" />

        <span className="block text-sm text-neutral-500 sm:text-center dark:text-neutral-400">
          &copy; {new Date().getFullYear()}{" "}
          <Link href="https://stratpoint.com">Stratpoint</Link>. All Rights
          Reserved.
        </span>
      </div>
    </footer>
  );
}
