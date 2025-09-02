"use client";

import { useTheme } from "@/components/ui/theme-provider";
import Image from "next/image";

export default function Tagline() {
  const theme = useTheme();
  return (
    <div className="bg-white py-[100px] dark:bg-neutral-900">
      <div className="container">
        <div className="space-y-15">
          <div className="text-center">
            <p className="text-neutral m-auto text-2xl font-black tracking-tight md:max-w-[700px] md:text-5xl dark:text-neutral-100">
              Move Projects Forward, Without the Friction
            </p>
            <p className="text-md m-auto mt-3 md:max-w-[700px] md:text-xl dark:text-neutral-300">
              <span className="text-primary font-bold dark:text-white">
                Fluid
              </span>{" "}
              helps teams collaborate, stay aligned, and deliver work smoothly
              without the usual project chaos.
            </p>
          </div>

          <div className="relative aspect-[16/7.5] w-full">
            <Image
              fill
              alt="kanban"
              sizes="(min-width: 768px) 100vw"
              src={`/assets/images/misc/kanban-${theme.theme}.png`}
              className="ring-primary/20 rounded-lg object-cover shadow-lg ring-7 dark:ring-white/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
