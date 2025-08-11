import Hero from "@/components/sections/home/hero";
import { Header } from "@/components/ui/header";
import { Fragment } from "react";

export default function HomePage() {
  return (
    <Fragment>
      <Header />
      <Hero />
    </Fragment>
  );
}
