import React from "react";

interface TikTokEmbedProps {
  url: string;
}

const TikTokEmbed: React.FC<TikTokEmbedProps> = ({ url }) => {
  const videoId = url.split("/").pop(); // Ambil ID Video dari URL

  return (
    <div className="flex justify-center p-4">
      <iframe
        src={`https://www.tiktok.com/embed/${videoId}`}
        className="rounded-lg shadow-lg"
        allow="encrypted-media"
        title="TikTok video"
        height={"600"}
        width={"350"}
      ></iframe>
    </div>
  );
};

export default TikTokEmbed;
