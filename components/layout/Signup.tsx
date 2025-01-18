"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { auth } from "@/config/firebase";

const SignUpFormSchema = z.object({
  firstname: z
    .string()
    .min(3, "must not be lesser than 3 characters")
    .max(25, "must not be greater than 25 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "must contain only letters, numbers and underscore (_)"
    ),
  lastname: z
    .string()
    .min(3, "must not be lesser than 3 characters")
    .max(25, "must not be greater than 25 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "must contain only letters, numbers and underscore (_)"
    ),
  email: z.string().email("Email must be a valid email address"),
  password: z
    .string()
    .min(8, "must not be lesser than 8 characters")
    .max(12, "must not be greater than 12 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,12}$/,
      "must be 8-12 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});
type ISignUpFormSchema = z.infer<typeof SignUpFormSchema>;

export function SignUpForm({
  openSignUpModel,
  setOpenSignupModal,
}: {
  openSignUpModel: boolean;
  setOpenSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpFormSchema>({
    resolver: zodResolver(SignUpFormSchema),
  });
  const onSubmit = async (userData: ISignUpFormSchema) => {
    if (userData) {
      console.log("🚀 ~ onSubmit ~ data:", userData);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_API_URL}/api/signup`,
        userData
      );
      console.log("🚀 ~ onSubmit ~ response:", response);
    }
  };
  const handleGoogleSignup = async () => {
    const provider: GoogleAuthProvider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, provider);
    console.log("🚀 ~ handleGoogleSignup ~ response:", response);
  };
  const handleGithubSignup = async () => {
    const provider: GithubAuthProvider = new GithubAuthProvider();
    const response = await signInWithPopup(auth, provider);
    console.log("🚀 ~ handleGithubSignup ~ response:", response);
  };
  return (
    <>
      <Dialog
        open={openSignUpModel}
        onOpenChange={(isOpen: boolean) => setOpenSignupModal(isOpen)}
      >
        <DialogContent className="sm:max-w-[550px] px-0">
          <div className="w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
            <DialogTitle className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-4">
              Welcome to ThoughtCanvas
            </DialogTitle>
            <DialogDescription className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
              Please Register Yourself!!
            </DialogDescription>

            <form className="mt-4 mb-8" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                <LabelInputContainer>
                  <Label htmlFor="firstname">First name</Label>
                  <Input
                    id="firstname"
                    placeholder="Tyler"
                    type="text"
                    {...register("firstname")}
                  />
                  {errors?.firstname?.message && (
                    <p className="text-red-700 mb-4 text-[12px]">
                      {errors.firstname.message}
                    </p>
                  )}
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="lastname">Last name</Label>
                  <Input
                    id="lastname"
                    placeholder="Durden"
                    type="text"
                    {...register("lastname")}
                  />
                  {errors?.lastname?.message && (
                    <p className="text-red-700 mb-4 text-[12px]">
                      {errors.lastname.message}
                    </p>
                  )}
                </LabelInputContainer>
              </div>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="projectmayhem@fc.com"
                  type="email"
                  {...register("email")}
                />
                {errors?.email?.message && (
                  <p className="text-red-700 mb-4 text-[12px]">
                    {errors.email.message}
                  </p>
                )}
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  {...register("password")}
                />
                {errors?.password?.message && (
                  <p className="text-red-700 mb-4 text-[12px]">
                    {errors.password.message}
                  </p>
                )}
              </LabelInputContainer>
              <DialogFooter style={{ flexDirection: "column" }}>
                <button
                  className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                  type="submit"
                >
                  Sign up &rarr;
                  <BottomGradient />
                </button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                <div className="flex flex-col space-y-4">
                  <button
                    className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                    type="submit"
                    onClick={handleGithubSignup}
                  >
                    <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                      GitHub
                    </span>
                    <BottomGradient />
                  </button>
                  <button
                    className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                    type="submit"
                    onClick={handleGoogleSignup}
                  >
                    <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                      Google
                    </span>
                    <BottomGradient />
                  </button>
                </div>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
