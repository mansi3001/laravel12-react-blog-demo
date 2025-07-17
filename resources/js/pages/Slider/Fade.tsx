import AppLayout from '@/layouts/app-layout';
import Slider from '@/components/Common/Slider';

const images = [
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

export default function FadeSliderPage() {
  return (
    <AppLayout breadcrumbs={[{ title: 'Slider', href: '/slider' }, { title: 'Fade', href: '/slider/fade' }]}>  
      <Slider images={images} variant="fade" />
      <div className="w-full mt-10 relative">
        <h1 className="text-3xl font-bold text-center mb-6">Fade Slider</h1>
      </div>
    </AppLayout>
  );
} 