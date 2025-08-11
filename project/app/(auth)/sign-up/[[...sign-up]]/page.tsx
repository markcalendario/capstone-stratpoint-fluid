import SignUpForm from "@/components/sections/sign-up/sign-up-form";
import { Header } from "@/components/ui/header";
import { Fragment } from "react";

export default function SignUpPage() {
  return (
    <Fragment>
      <Header />
      <SignUpForm />
    </Fragment>
  );
}
