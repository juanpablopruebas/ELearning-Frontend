import { Courses } from "@/components/public/Courses";
import { Hero } from "../utils/Hero";
import { Reviews } from "@/components/public/Reviews";
import { FAQ } from "@/components/public/FAQ";

export default function Page() {
  return (
    <>
      <Hero />
      <Courses />
      <Reviews />
      <FAQ />
    </>
  );
}
