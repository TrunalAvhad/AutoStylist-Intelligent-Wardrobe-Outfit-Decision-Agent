import React from "react";
import Mannequin from "./Mannequin";

const RecommendationCard = ({ title, data }) => {
  if (!data) return null;

  console.log("Rendering:", title, data);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 text-center">

      {/* <h2 className="text-xl font-semibold mb-4">{title}</h2> */}

      <div className="flex justify-center">
        <Mannequin top={data.top} bottom={data.bottom} />
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Score: <span className="font-medium">{data.score}</span>
        </p>
      </div>

    </div>
  );
};

export default RecommendationCard;