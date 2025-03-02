import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHash: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Hapus tanda '#' untuk mendapatkan id elemen
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Gulingkan ke elemen dengan efek smooth
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return null;
};

export default ScrollToHash;
