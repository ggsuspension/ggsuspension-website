import React from "react";

interface YouTubeShortsEmbedProps {
  videoId: string; // ID video Shorts (bukan URL penuh)
}

const YouTubeShortsEmbed: React.FC<YouTubeShortsEmbedProps> = ({ videoId }) => {
  return (
    <div className="flex justify-center p-4">
      <iframe
        width="330"
        height="600"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0`}
        title="YouTube Shorts Player"
        frameBorder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-lg shadow-lg"
      ></iframe>
    </div>
  );
};

export default YouTubeShortsEmbed;
