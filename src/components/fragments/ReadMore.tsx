import { useState } from "react";

const ReadMore = ({ children }: any) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      {/* Container teks dengan transisi */}
      <div
        className={`${
            expanded ? "h-full" : "h-[15em]"
          }  overflow-hidden text-gray-600 text-left transition-all duration-100`}
      >
        {children}
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-500 mt-2 focus:outline-none font-semibold"
      >
        {expanded ? "Tutup" : "Baca selengkapnya"}
      </button>
    </div>
  );
};

export default ReadMore;
