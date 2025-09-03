import { ArrowLeft } from "lucide-react";
import LinkButton from "../ui/buttons/link-button";

interface ErrorPageProps {
  code: number;
  title: string;
  description: string;
}

export default function ErrorPage({
  code,
  title,
  description
}: ErrorPageProps) {
  return (
    <section className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-neutral-900">
      <div className="container">
        <div className="text-center">
          <p className="text-primary text-base font-semibold">{code}</p>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-balance text-neutral-900 sm:text-4xl dark:text-white">
            {title}
          </h1>
          <p className="mt-4 text-lg font-medium text-pretty text-neutral-600 sm:text-xl dark:text-neutral-400">
            {description}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <LinkButton
              href="/dashboard"
              className="bg-primary hover:bg-primary/90 text-md text-white transition-colors">
              <ArrowLeft size={16} /> Go back home
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
