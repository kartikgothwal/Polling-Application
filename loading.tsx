import React from "react";
import LoadingSpinner from "./components/loadingSpinner";
const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
};

export default Loading;
