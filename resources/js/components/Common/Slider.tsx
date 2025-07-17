import React, { useState, useEffect, useRef } from 'react';

interface SliderProps {
  images: string[];
  variant?: 'classic' | 'fade' | 'thumbnails';
}

const SLIDE_INTERVAL = 3000;

const Slider: React.FC<SliderProps> = ({ images, variant = 'classic' }) => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const goToSlide = (idx: number) => setCurrent(idx);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(nextSlide, SLIDE_INTERVAL);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, images.length]);

  // Classic: arrows + dots
  if (variant === 'classic') {
    return (
      <div className="relative overflow-hidden rounded-xl shadow-lg h-[500px] bg-gray-100 dark:bg-gray-800 w-full">
        {images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Slide ${idx + 1}`}
            className={`w-full h-[500px] object-cover absolute left-0 top-0 transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            draggable={false}
          />
        ))}
        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 border-none rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow hover:bg-white/90 dark:hover:bg-gray-900/90 transition z-20"
          aria-label="Previous slide"
        >
          &#x2039;
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 dark:bg-gray-900/80 border-none rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold shadow hover:bg-white/90 dark:hover:bg-gray-900/90 transition z-20"
          aria-label="Next slide"
        >
          &#x203A;
        </button>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full border-none transition-colors duration-300 ${idx === current ? 'bg-gray-800 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600 opacity-60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Fade: no arrows, only dots, smooth fade
  if (variant === 'fade') {
    return (
      <div className="relative overflow-hidden rounded-xl shadow-lg h-[500px] bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 w-full">
        {images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Slide ${idx + 1}`}
            className={`w-full h-[500px] object-cover absolute left-0 top-0 transition-opacity duration-1000 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            draggable={false}
          />
        ))}
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-4 h-4 rounded-full border-2 border-white dark:border-gray-700 transition-colors duration-300 ${idx === current ? 'bg-purple-600 dark:bg-white' : 'bg-white/60 dark:bg-gray-700 opacity-60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Thumbnails: show thumbnails below, click to jump, arrows optional
  if (variant === 'thumbnails') {
    return (
      <div className="relative overflow-hidden rounded-xl shadow-lg h-[500px] bg-gray-50 dark:bg-gray-900 w-full flex flex-col items-center">
        {images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Slide ${idx + 1}`}
            className={`w-full h-[500px] object-cover absolute left-0 top-0 transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            draggable={false}
          />
        ))}
        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-gray-200/80 dark:bg-gray-800/80 border-none rounded w-8 h-8 flex items-center justify-center text-xl font-bold shadow hover:bg-gray-300/90 dark:hover:bg-gray-700/90 transition z-20"
          aria-label="Previous slide"
        >
          &#x2039;
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-200/80 dark:bg-gray-800/80 border-none rounded w-8 h-8 flex items-center justify-center text-xl font-bold shadow hover:bg-gray-300/90 dark:hover:bg-gray-700/90 transition z-20"
          aria-label="Next slide"
        >
          &#x203A;
        </button>
        {/* Thumbnails */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded shadow">
          {images.map((img, idx) => (
            <img
              key={img}
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              onClick={() => goToSlide(idx)}
              className={`w-16 h-10 object-cover rounded cursor-pointer border-2 transition-all duration-300 ${idx === current ? 'border-blue-600 scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
              draggable={false}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default fallback
  return null;
};

export default Slider; 