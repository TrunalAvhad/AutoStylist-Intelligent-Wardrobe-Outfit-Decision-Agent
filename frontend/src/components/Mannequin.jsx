import React from "react";
import { BACKEND_BASE_URL } from "../services/api";

const Mannequin = ({ top, bottom }) => {
  const topUrl = top?.startsWith("http")
    ? top
    : `${BACKEND_BASE_URL}/${top}`;

  const bottomUrl = bottom?.startsWith("http")
    ? bottom
    : `${BACKEND_BASE_URL}/${bottom}`;

  return (
    <div className="relative w-[320px] aspect-[1/2] mx-auto">

      {/* Mannequin Base */}
      {/* <img
        src="/mannequin.png"
        alt="Mannequin"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      /> */}

       {/* Shirt Overlay */}
      {top && (
        <img
          src={topUrl}
          alt="Top"
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: "20%",
            width: "70%",
            height: "35%",
            zIndex: 3
          }}
        />
      )}hn 
      {/* Pants Overlay */}
      {bottom && (
        <img
          src={bottomUrl}
          alt="Bottom"
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: "50%",
            width: "70%",
            height: "45%",
            zIndex: 2
          }}
        />
      )}

      

    </div>
  );
};

export default Mannequin;