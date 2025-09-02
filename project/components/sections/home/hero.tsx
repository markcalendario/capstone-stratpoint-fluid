import LinkButton from "@/components/ui/buttons/link-button";
import { Blocks, Kanban } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden dark:bg-neutral-800">
      <div className="container">
        <div className="mt-[64px] flex min-h-[calc(100vh-64px)] flex-col justify-center">
          <div className="flex flex-col items-center gap-[50px] py-[70px] md:flex-row">
            <div className="md:w-[55%]">
              <h1 className="mb-3 text-5xl font-bold tracking-tighter lg:text-7xl dark:text-neutral-100">
                Manage Projects with{" "}
                <span className="text-primary font-black dark:text-white">
                  Kanban Boards
                </span>
              </h1>
              <p className="mb-5 text-xl dark:text-neutral-300">
                Organize tasks, collaborate with teams, and track progress with
                our intuitive drag-and-drop project management platform.
              </p>

              <div className="flex flex-wrap gap-1">
                <LinkButton
                  href="/sign-in"
                  className="bg-primary text-neutral-100">
                  <Kanban size={16} />
                  Manage Projects
                </LinkButton>
                <LinkButton
                  href="/sign-up"
                  className="bg-neutral-900 text-neutral-100 dark:bg-neutral-900">
                  <Blocks size={16} />
                  Join Now
                </LinkButton>
              </div>
            </div>

            <div className="relative aspect-square w-full md:absolute md:right-[-100px] md:w-[40%]">
              <Image
                fill
                alt="hero avatar"
                className="svg-primary dark:svg-white object-contain"
                sizes="(min-width: 768px) 75vw, 100vw"
                src="/assets/images/graphics/team-building.svg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
