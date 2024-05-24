import React from "react";
import { useRouter } from "next/router";

const Failed = () => {
  const router = useRouter();

  const handleRetry = () => {
    router.back(); 
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-red-600 mb-8">
        Subscription Failed. Please Retry!
      </h2>
      <button
        onClick={handleRetry}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
      >
        Retry
      </button>
    </div>
  );
};

export default Failed;
