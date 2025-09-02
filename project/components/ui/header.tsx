"use client";

import { MenuIcon, Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState } from "react";
import Button from "./buttons/button";
import { useTheme } from "./theme-provider";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/sign-in", label: "Sign In" },
  { href: "/sign-out", label: "Get Started" }
];

export function Header() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  return (
    <nav className="bg-primary/90 fixed top-0 left-0 z-1 w-full border-b-1 border-neutral-600 backdrop-blur-2xl dark:bg-neutral-900/80">
      <div className="container">
        <div className="flex items-center justify-between">
          <Logo />
          <Menu
            isMobile={isMobile}
            setIsMobile={setIsMobile}
          />
          <CallToActions isMobile={isMobile} />
        </div>
      </div>
    </nav>
  );
}

function Logo() {
  return (
    <div className="md:w-[calc(100%/3)]">
      <div className="inline-block bg-neutral-100 px-2 py-3 dark:bg-neutral-800">
        <Link
          href="/"
          className="relative block aspect-square w-[40px] overflow-hidden">
          <Image
            fill
            alt="brand logo"
            sizes="(max-width: 768px) 100vw, 50vw"
            src="/assets/images/logo.svg"
            className="svg-primary dark:svg-white"
          />
        </Link>
      </div>
    </div>
  );
}

interface Menu {
  isMobile: boolean | null;
  setIsMobile: (isMobile: boolean) => void;
}

function Menu({ isMobile, setIsMobile }: Menu) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const shouldDisplayLinks = useCallback(() => {
    const screenWidth = window.innerWidth;
    setIsMobile(screenWidth < 768);
  }, [setIsMobile]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    shouldDisplayLinks();
    window.addEventListener("resize", shouldDisplayLinks);

    return () => window.removeEventListener("resize", shouldDisplayLinks);
  }, [shouldDisplayLinks]);

  return (
    <Fragment>
      <MenuItems
        isMobile={isMobile}
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
      />

      <MenuButton
        isMobile={isMobile}
        toggleMenu={toggleMenu}
      />
    </Fragment>
  );
}

interface MenuItemsProps {
  isMobile: boolean | null;
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

function MenuItems({ isMobile, isMenuOpen, toggleMenu }: MenuItemsProps) {
  const shouldDisplay = (isMobile && isMenuOpen) || isMobile === false;

  if (!shouldDisplay) return null;

  return (
    <div className="bg-primary fixed top-[60px] left-0 flex h-[calc(100vh-60px)] w-full flex-col gap-[30px] p-[20px] md:static md:top-auto md:left-auto md:h-auto md:w-[calc(100%/3)] md:flex-row md:justify-center md:gap-[10px] md:bg-transparent md:p-0 dark:max-md:bg-neutral-900">
      {NAV_LINKS.map((link, i) => (
        <Link
          key={i}
          href={link.href}
          onClick={toggleMenu}
          className="block rounded-sm font-[500] text-neutral-200 duration-300 ease-in-out md:px-[15px] md:py-[5px] md:text-neutral-200 md:hover:bg-neutral-100/20">
          {link.label}
        </Link>
      ))}
    </div>
  );
}

interface MenuButtonProps {
  isMobile: boolean | null;
  toggleMenu: () => void;
}

function MenuButton({ isMobile, toggleMenu }: MenuButtonProps) {
  if (!isMobile) return;

  return (
    <button
      onClick={toggleMenu}
      className="cursor-pointer rounded-sm bg-neutral-100 p-[5px]">
      <MenuIcon />
    </button>
  );
}

interface CallToActions {
  isMobile: boolean | null;
}

function CallToActions({ isMobile }: CallToActions) {
  const { theme, setTheme } = useTheme();
  const toggle = () => setTheme(theme === "light" ? "dark" : "light");

  if (isMobile) return;

  return (
    <div className="flex justify-end gap-1 md:w-[calc(100%/3)]">
      <Button
        className="bg-neutral-100 p-[10px] dark:bg-neutral-800 dark:text-neutral-100"
        onClick={toggle}>
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      </Button>
    </div>
  );
}
