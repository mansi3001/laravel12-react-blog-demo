import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import Slider from '@/components/Common/Slider';

const sliderImages = [
  'https://picsum.photos/id/1015/800/400',
  'https://picsum.photos/id/1016/800/400',
  'https://picsum.photos/id/1018/800/400',
  'https://picsum.photos/id/1020/800/400',
  'https://picsum.photos/id/1024/800/400',
  'https://picsum.photos/id/1025/800/400',
  'https://picsum.photos/id/1035/800/400',
  'https://picsum.photos/id/1040/800/400',
  'https://picsum.photos/id/1045/800/400',
];

const sliderVariants: ("classic" | "fade" | "thumbnails")[] = ['classic', 'fade', 'thumbnails'];

export default function SliderPage() {
  const [selected, setSelected] = useState(0);

  return (
    <AppLayout breadcrumbs={[{ title: 'Slider', href: '/slider' }]}>  
      <div className="w-full mt-10 relative">
        <h1 className="text-3xl font-bold text-center mb-6">Image Slider</h1>
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded font-semibold border transition ${selected === 0 ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border-gray-300'}`}
            onClick={() => setSelected(0)}
          >
            Slider 1
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold border transition ${selected === 1 ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border-gray-300'}`}
            onClick={() => setSelected(1)}
          >
            Slider 2
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold border transition ${selected === 2 ? 'bg-gray-800 text-white' : 'bg-white text-gray-800 border-gray-300'}`}
            onClick={() => setSelected(2)}
          >
            Slider 3
          </button>
        </div>
        <Slider images={sliderImages} variant={sliderVariants[selected]} />
      </div>
    </AppLayout>
  );
} 