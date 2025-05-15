/**
 * Base64Image Component
 * 
 * A React component for displaying images from Base64 encoded strings
 * 
 * @param {Object} props
 * @param {string} props.base64String - The Base64 encoded image string (can include or exclude data URI prefix)
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.className - Optional CSS class names
 * @param {Object} props.style - Optional inline styles
 * @param {string} props.imageType - Optional image MIME type (default: 'image/png')
 */
const Base64Image = ({ 
  base64String, 
  alt = 'Base64 Image', 
  className = ' object-cover object-center',
  style = {},
  imageType = 'image/png'
}: { base64String: any; alt: string; className: string; style: object; imageType: string; }) => {
  // Check if the base64String already has the data URI prefix
  const hasPrefix = base64String && 
    (base64String.startsWith('data:image/') || 
     base64String.startsWith('data:application/'));
  
  // Create the complete data URI if it doesn't have one
  const imgSrc = hasPrefix ? base64String : `data:${imageType};base64,${base64String}`;

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      style={style} 
    />
  );
};

export default Base64Image;