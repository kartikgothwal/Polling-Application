"use client";
import PollForm from "@/components/pollForm";

export default function Create() {
  return (
    <>
      <div
        className={`dark:bg-slate-800 bg-gray-100 flex flex-col  items-center w-screen min-h-screen px-[8rem] font-sans relative pt-[3rem] overflow-hidden overflow-x-hidden`}
      >
        <div className="absolute text-green-500 dark:text-green-300 top-0 p-2 flex justify-left text-sm items-left w-full lg:w-1/2 md:w-2/3"></div>
        <div className="flex flex-col justify-center items-center w-full lg:w-1/2 md:w-2/3 h-3/4 p-2">
          <h1 className="text-2xl font-bold dark:text-gray-200 text-gray-800">
            Create a poll
          </h1>
        </div>
        <PollForm onSubmit={() => {}} redirectPath={`/dashboard`} />
      </div>
    </>
  );
}
