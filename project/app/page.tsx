import Features from "@/components/sections/home/features";
import Footer from "@/components/sections/home/footer";
import Hero from "@/components/sections/home/hero";
import Tagline from "@/components/sections/home/tagline";
import { Header } from "@/components/ui/header";
import { Fragment } from "react";

export default function HomePage() {
  return (
    <Fragment>
      <Header />
      <Hero />
      <Tagline />
      <Features />
      <Footer />
    </Fragment>
  );
}
