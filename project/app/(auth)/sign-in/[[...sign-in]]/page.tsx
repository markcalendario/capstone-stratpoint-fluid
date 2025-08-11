import SignInForm from "@/components/sections/sign-in/sign-in-form";
import { Header } from "@/components/ui/header";
import { Fragment } from "react";

export default function SignInPage() {
  return (
    <Fragment>
      <Header />
      <SignInForm />
    </Fragment>
  );
}
