"use client";
import { useMutationQueries } from "@/apiquery/useApiQuery";
import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { getCookie } from "@/utils/GetCookie";

const PollCard = ({ poll }) => {
  const [userVote, setUserVote] = useState(null);
  const { mutate: voteMutation } = useMutationQueries("votepoll", "polls/vote");

  useEffect(() => {
    const fetchUserVote = async () => {
      try {
        const userId = await getCookie("userId");
        if (userId) {
          const existingVote = poll.votes.find(vote => vote.user.toString() === userId);
          if (existingVote) {
            setUserVote(existingVote.optionIndex);
          }
        }
      } catch (error) {
        console.error("Error fetching user vote:", error);
      }
    };

    fetchUserVote();
  }, [poll]);

  const handleVote = async (TargetPoll, optionIndex) => {
    try {
      const userId = await getCookie("userId");
      console.log("🚀 ~ handleVote ~ userId:", userId);
      if (!userId) {
        toast.error("User ID not found. Please log in.");
        return;
      }

      const pollData = {
        pollId: TargetPoll._id,
        userId,
        optionIndex
      };

      console.log("🚀 ~ Voting on poll:", pollData);

      voteMutation(pollData, {
        onSuccess: () => {
          setUserVote(optionIndex);
          toast.success("Vote submitted successfully!");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to submit vote.");
        },
      });
    } catch (error) {
      console.error("Error fetching userId from cookies:", error);
      toast.error("Something went wrong.");
    }
  };

   const totalVotes = useMemo(() => poll.votes.length, [poll.votes]);
  const votesPerOption = useMemo(() => 
    poll.options.map((_, index) => 
      poll.votes.filter(vote => vote.optionIndex === index).length
    ), [poll.options, poll.votes]
  );

  return (
    <div className="poll-card bg-white dark:bg-neutral-900 shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        {poll.question}
      </h3>
      <ul className="space-y-2">
        {poll.options.map((option, index) => (
          <li key={index} className="flex items-center">
            <input
              type={poll.allowMultiple ? "checkbox" : "radio"}
              name={poll._id}
              id={`${poll._id}-${index}`}
              className="mr-2"
              checked={userVote === index}
              onChange={() => handleVote(poll, index)}
            />
            <label
              htmlFor={`${poll._id}-${index}`}
              className="flex-1 text-gray-700 dark:text-gray-300"
            >
              {option}
            </label>
            <span className="text-gray-500 dark:text-gray-400">
              {votesPerOption[index]} votes ({((votesPerOption[index] / totalVotes) * 100).toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Total votes: {totalVotes}</p>
    </div>
  );
};

export default PollCard;
