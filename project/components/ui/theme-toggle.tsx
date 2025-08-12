"use client";

import { Moon, Sun } from "lucide-react";
import Button from "./buttons/button";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggle = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <Button
      className="bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-100"
      onClick={toggle}>
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </Button>
  );
}
