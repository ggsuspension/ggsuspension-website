import { useState, useEffect } from 'react';
import { RiAccountCircleFill } from 'react-icons/ri';

const PremiumTestimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  
  const testimonials = [
    {
      id: 1,
      name: "Rifan Setya",
      title: "Professional Track Racer",
      location: "California, USA",
      rating: 5,
      image: "/api/placeholder/100/100",
      text: "Mtor jdi kece hbs didownsize..",
      product: "Downsize",
      vehicle: "Yamaha R1M",
      background: "bg-gradient-to-r from-blue-900 to-black"
    },
    {
      id: 3,
      name: "Bagus Surya",
      title: "MotoGP Fan & Collector",
      location: "Milan, Italy",
      rating: 5,
      image: "/api/placeholder/100/100",
      text: "Pelayananya ramah cepet, pasti langganan sini",
      product: "Paket Rebound & Downsize",
      vehicle: "Ducati Panigale V4",
      background: "bg-gradient-to-r from-green-900 to-black"
    },
    {
      id: 4,
      name: "Asep Setiawan",
      title: "Adventure Rider",
      location: "Melbourne, Australia",
      rating: 5,
      image: "/api/placeholder/100/100",
      text: "Mantul lah pokok e",
      product: "Maintenance",
      vehicle: "BMW GS 1250",
      background: "bg-gradient-to-r from-gray-700 to-black"
    }
  ];
  
  // Auto-advance testimonials
  useEffect(() => {
    let interval:any;
    if (isAutoplay) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoplay, testimonials.length]);

  // Pause autoplay when user interacts
  const handleIndicatorClick = (index:any) => {
    setActiveIndex(index);
    setIsAutoplay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  const activeTesti = testimonials[activeIndex];

  return (
    <div className='relative'>
      <img src="./mekanik.jpg" className="w-full h-full object-cover object-center absolute opacity-10" alt="" />
    <section id='testimoni' className="px-6 pb-20 md:px-0 overflow-hidden relative">      
      <div className="absolute left-12 top-0 h-full w-1/2 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 400" className="text-blue-800 bg-yellow-100">
          <path d="M50,0 L50,400 M30,50 L70,50 M30,100 L70,100 M20,150 C40,170 60,170 80,150 M30,200 L70,200 M20,250 C40,270 60,270 80,250 M30,300 L70,300 M30,350 L70,350" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="" />
        </svg>
      </div>
      <div className="absolute right-0 top-1/2 h-full w-1/3 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 400" className="text-blue-800 bg-yellow-100">
          <path d="M50,0 L50,400 M30,50 L70,50 M30,100 L70,100 M20,150 C40,170 60,170 80,150 M30,200 L70,200 M20,250 C40,270 60,270 80,250 M30,300 L70,300 M30,350 L70,350" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="" />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto pt-10">
        <div className="mb-5 relative">
          <h2 className="font-bold text-gray-800 uppercase tracking-wide text-center">
            <span className='font-medium text-3xl '>APA ?</span><br/>
            <span className="text-4xl">KATA MEREKA</span>
          </h2>
        </div>
        
        {/* Main testimonial display */}
        <div className="relative">
          <div 
            className={`rounded-lg w-full tablet:w-1/2 mx-auto overflow-hidden transition-all duration-700 shadow-xl ${activeTesti.background} `}
          >
            <div className="md:flex items-stretch">
              {/* Right content - testimonial */}
              <div className="md:w-2/3 p-8 md:p-12 text-white relative">
              
                {/* Product tag */}
                <div className="inline-block bg-yellow-400 px-4 py-1 font-semibold rounded-full text-xl mb-6 text-black">
                  {activeTesti.product}
                </div>
                
                {/* Testimonial text */}
                <div className="relative">
                  <svg className="text-white opacity-20 w-16 h-16 absolute -top-6 -left-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-2xl font-light mb-8 leading-relaxed relative z-10">
                    {activeTesti.text}
                  </p>
                </div>
                
                {/* User info */}
                <div className="flex items-center mt-8">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 ">
                    <RiAccountCircleFill className='w-full h-full text-blue-500'/>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-xl">{activeTesti.name}</h3>
                    <p className="text-gray-300">{activeTesti.vehicle}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-5 h-5 ${i < activeTesti.rating ? "text-yellow-400" : "text-gray-600"}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial navigation */}
          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleIndicatorClick(index)}
                className={`w-3 h-3 mx-2 rounded-full transition-all ${
                  index === activeIndex 
                    ? 'bg-yellow-400 w-8' 
                    : 'bg-gray-400 hover:bg-gray-600'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
};

export default PremiumTestimonials;