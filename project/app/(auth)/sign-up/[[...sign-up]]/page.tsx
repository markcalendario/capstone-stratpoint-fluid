import { Header } from "@/components/header";
import SignUpForm from "@/components/sections/sign-up/sign-up-form";
import { Fragment } from "react";

export default function SignUpPage() {
  return (
    <Fragment>
      <Header />
      <SignUpForm />
    </Fragment>
  );
}
