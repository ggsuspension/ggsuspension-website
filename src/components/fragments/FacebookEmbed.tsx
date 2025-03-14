import { useEffect } from "react";

interface FacebookVideoEmbedProps {
  videoUrl: string; // URL video Facebook
}

const FacebookVideoEmbed: React.FC<FacebookVideoEmbedProps> = ({ videoUrl }) => {
  useEffect(() => {
    // Memuat SDK Facebook jika belum ada
    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center p-4">
      <div
        className="fb-video"
        data-href={videoUrl}
        data-width="340"
        data-height="600"
        data-allowfullscreen="true"
      ></div>
    </div>
  );
};

export default FacebookVideoEmbed;
