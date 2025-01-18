import { About } from "@/components/layout/About";
import { Hero } from "@/components/layout/Hero";
import { Navbar } from "@/components/layout/Navbar";
import dbConnect from "@/config/dbConnect";

const Page = () => {
  // dbConnect();
  console.log("APP_URL:", process.env.APP_URL);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
    </>
  );
};

export default Page;
