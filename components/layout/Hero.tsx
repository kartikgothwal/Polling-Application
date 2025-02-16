"use client";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { HeroCards } from "./HeroCards";
// import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { styles } from "@/utils/styles";
import { useState } from "react";
import { SignUpForm } from "./Signup";
export const Hero = () => {
  const [openSignUpModel, setOpenSignupModal] = useState<boolean>(false);
  return (
    <section
      className={`container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10 ${styles.paddingX}`}
    >
      <div className={`text-center lg:text-start space-y-6`}>
        <main className="text-5xl md:text-6xl font-bold">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-[#F596D3]  to-[#D247BF] text-transparent bg-clip-text">
              Polling
            </span>{" "}
            Application
          </h1>{" "}
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          A place to read, write, and deepen your understanding
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Button
            className="w-full md:w-1/3"
            onClick={() => {
              setOpenSignupModal(!openSignUpModel);
            }}
          >
            Get Started
          </Button>

          <Link
            rel="noreferrer noopener"
            href="https://github.com/kartikgothwal/thoughtcanvas"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Github Repository
          </Link>
        </div>
      </div>

      <div className="z-10">
        <HeroCards />
      </div>

      <div className="shadow"></div>
      {openSignUpModel && (
        <SignUpForm
          openSignUpModel={openSignUpModel}
          setOpenSignupModal={setOpenSignupModal}
        />
      )}
    </section>
  );
};
