import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const InterviewCard = ({ heading, href, description }) => {
  const [color, setColor] = useState("gray-600");

  return (
    <Link href={href}>
      <div
        className={`min-h-40 relative px-10 py-6 bg-white hover:bg-primaryColor-level3/40 border-2 border-${color} border-opacity-50 rounded-lg hover:scale-102 hover:shadow-md cursor-pointer transition-all`}
        onMouseOver={() => setColor("primaryColor")}
        onMouseOut={() => setColor("gray-600")}
      >
        <h1 className="font-bold text-lg">{heading}</h1>
        <p className="text-sm mt-5">{description}</p>
        <ArrowRight
          className={`absolute top-7 right-8 bg-${color} text-white p-1 rounded-full`}
        />
      </div>
    </Link>
  );
};

export default InterviewCard;
