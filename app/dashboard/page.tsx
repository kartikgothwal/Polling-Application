"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoMdSearch } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useGetRefetchQueries } from "@/apiquery/useApiQuery";
import PollCard from "@/components/pollCard";
import { deleteCookie } from "@/utils/DeleteCookie";
import toast from "react-hot-toast";

export default function SidebarDemo() {
  const router = useRouter();
  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Create Poll",
      href: "/create-poll",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => handleLogout(),
    },
  ];

  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await deleteCookie("all");
      router.push("/");
      toast.success("You have been logged out");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Kartik Gothwal",
                href: "#",
                icon: (
                  <Image
                    src="/"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <div className="flex flex-row justify-between">
      <Link
        href="#"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-black dark:text-white whitespace-pre"
        >
          Polling App
        </motion.span>
      </Link>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

export const CreatePost = () => {
  const router = useRouter();

  return (
    <div className="w-1/4 flex justify-end items-center gap-2">
      <Button
        className="p-2"
        variant={"secondary"}
        onClick={() => router.push("/create-poll")}
      >
        <IoMdAddCircleOutline style={{ height: "1.3em", width: "1.3em" }} />
        Create Polls
      </Button>
      <ModeToggle />
    </div>
  );
};

export const SearchInput = () => {
  return (
    <div className="relative w-1/4">
      <IoMdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search Blogs and Peoples"
        className="pl-10"
      />
    </div>
  );
};

export const TopBar = () => {
  return (
    <div className={`hidden md:flex justify-between items-center`}>
      <SearchInput />
      <CreatePost />
    </div>
  );
};

const Dashboard = () => {
  const {
    data: polls,
    error,
    isLoading,
  } = useGetRefetchQueries("polls", "polls", 5000);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading polls</div>;
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-5 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 w-full h-full">
        <TopBar />
        <div className="flex gap-2 flex-1 flex-col overflow-y-scroll">
          <div className="w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-3">
            {polls?.data?.length > 0 ? (
              <div className="space-y-4">
                {polls?.data?.map((poll) => (
                  <PollCard key={poll.id} poll={poll} />
                ))}
              </div>
            ) : (
              <p>No polls available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
