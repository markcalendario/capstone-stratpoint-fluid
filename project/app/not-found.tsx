import LinkButton from "@/components/ui/buttons/link-button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-neutral-900">
      <div className="container">
        <div className="text-center">
          <p className="text-primary text-base font-semibold">404</p>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-balance text-neutral-900 sm:text-4xl dark:text-white">
            Nice! You found... a Not Found page.
          </h1>
          <p className="mt-4 text-lg font-medium text-pretty text-neutral-600 sm:text-xl dark:text-neutral-400">
            Sorry, the page you are looking for is not found.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <LinkButton
              href="/dashboard"
              className="bg-primary hover:bg-primary/90 text-lg text-white transition-colors">
              <ArrowLeft /> Go back home
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
