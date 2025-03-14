// Define the technology data
const technologies = [
  {
    image: "images/ttx.jpg",
    title: "TTX",
    description: "Race proven twin-tube damping system used in front forks and rear shocks to meet the highest demands for performance.",
  },
  {
    image: "images/stx.jpg",
    title: "STX",
    description: "Single-tube damping system developed for consistent performance, comfort, and safety across a variety of applications.",
  },
  {
    image: "images/dfv.jpg",
    title: "DFV",
    description: "Dual Flow Valve technology—the key to achieving both comfort and agility in our Automotive Road & Track products.",
  },
  {
    image: "images/nix.jpg",
    title: "NIX",
    description: "The cartridge kit designed to optimize your riding experience.",
  },
];

// TechnologyCard component for each technology item
const TechnologyCard = ({ image, title, description }:any) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold uppercase text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  );
};

// Main TechnologySection component
const TechnologySection = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold uppercase text-gray-800">
            ADVANCED SUSPENSION TECHNOLOGY
          </h1>
          <p className="text-gray-600 mt-2">
            Our passion for innovation and state-of-the-art technology is the driving force in the search for the next generation of advanced suspension technology.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {technologies.map((tech, index) => (
            <TechnologyCard
              key={index}
              image={tech.image}
              title={tech.title}
              description={tech.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;