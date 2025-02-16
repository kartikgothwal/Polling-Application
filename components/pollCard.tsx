import React from "react";

const PollCard = ({ poll }) => {
  return (
    <div className="poll-card bg-white dark:bg-neutral-900 shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{poll.question}</h3>
      <ul className="space-y-2">
        {poll.options.map((option, index) => (
          <li key={index} className="flex items-center">
            <input type="radio" name={poll.id} id={`${poll.id}-${index}`} className="mr-2" />
            <label htmlFor={`${poll.id}-${index}`} className="text-gray-700 dark:text-gray-300">{option}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollCard;
