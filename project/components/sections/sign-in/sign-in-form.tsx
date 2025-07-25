import { SignIn } from "@clerk/nextjs";

export default function SignInForm() {
  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-neutral-100 dark:bg-neutral-900 sm:min-h-[calc(100vh-65px)]">
      <SignIn
        appearance={{
          elements: {
            // Layout & Card
            cardBox: "rounded-none my-5 shadow-md border-1",
            card: "rounded-none bg-white dark:bg-neutral-800 shadow-none",

            // Header
            header: "text-left",
            headerTitle: "text-xl text-blue_munsell-500 dark:text-neutral-100",
            headerSubtitle: "text-neutral-800 dark:text-neutral-200",

            // Social Buttons
            socialButtonsBlockButton:
              "rounded-none py-[10px] bg-white text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",

            // Divider
            dividerLine: "bg-neutral-300 dark:bg-neutral-700",
            dividerText: "text-neutral-700 dark:text-neutral-300",

            // Form
            formFieldLabel: "text-neutral-900 dark:text-neutral-100",
            formFieldInput:
              "rounded-none py-[10px] bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 placeholder-neutral-500",
            formButtonPrimary:
              "bg-blue_munsell-500 hover:bg-blue_munsell-600 py-[10px] rounded-sm",

            // Footer
            footerAction: "bg-neutral-100 w-full dark:bg-neutral-700",
            footerActionText: "text-neutral-600 dark:text-neutral-300",
            footerActionLink: "text-blue_munsell-600 dark:text-white"
          }
        }}
        signUpUrl="/sign-up"
      />
    </section>
  );
}
