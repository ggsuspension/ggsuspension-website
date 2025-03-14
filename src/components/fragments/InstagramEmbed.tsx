import { useEffect } from "react";

type Props = {
  url: string;
};

const InstagramEmbed = ({ url }: Props) => {
  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
      ></blockquote>
    </div>
  );
};

export default InstagramEmbed;
