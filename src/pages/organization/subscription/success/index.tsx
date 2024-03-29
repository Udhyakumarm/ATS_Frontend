import React from "react";
import { useRouter } from "next/router";

const Success = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // Navigate back to the previous page
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-green-600 mb-8">
        Your plan has been successfully subscribed!
      </h2>
      <button
        onClick={handleGoBack}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
      >
        Go Back
      </button>
    </div>
  );
};

export default Success;
