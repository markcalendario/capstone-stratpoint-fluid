import { SignUp } from "@clerk/nextjs";

export default function SignUpForm() {
  return (
    <section className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-neutral-100 dark:bg-neutral-900 sm:min-h-[calc(100vh-65px)]">
      <SignUp
        appearance={{
          elements: {
            card: "dark:bg-neutral-800 bg-white rounded-lg shadow-sm",
            formButtonPrimary:
              "bg-blue_munsell-500 hover:bg-blue_munsell-600 rounded-sm",
            headerTitle: "text-blue_munsell-500",
            headerSubtitle: "dark:text-neutral-100",
            socialButtonsBlockButtonText: "dark:text-neutral-100",
            socialButtonsBlockButton: "dark:bg-neutral-700",
            socialButtonsBlockButtonArrow: "dark:text-neutral-100",
            footerActionText: "dark:text-neutral-300",
            footerActionLink: "dark:text-neutral-100",
            formFieldLabel: "dark:text-neutral-100",
            formFieldInput:
              "rounded-sm focus:border-1 focus:border-blue_munsell-500 focus:shadow-none",
            dividerLine: "dark:bg-neutral-400",
            dividerText: "dark:text-neutral-300"
          }
        }}
        signInUrl="/sign-in"
        afterSignUpUrl="/sign-in"
        afterSignInUrl="/dashboard"
      />
    </section>
  );
}
