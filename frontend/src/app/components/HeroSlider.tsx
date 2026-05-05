import { useState, useRef } from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    title: '혁신적인 패션 플랫폼',
    subtitle: '디자이너 브랜드부터 리셀까지, 모든 스타일을 경험하는 모든 것',
    buttonText: '지금 살펴보기',
    backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1440&h=500&fit=crop&q=80',
  },
  {
    id: 2,
    title: '함께 만드는 패션',
    subtitle: '크라우드 펀딩으로 디자이너의 꿈을 응원하세요',
    buttonText: '펀딩 둘러보기',
    backgroundImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1440&h=500&fit=crop&q=80',
  },
  {
    id: 3,
    title: '지속 가능한 패션',
    subtitle: '리셀 마켓에서 새로운 가치를 발견하세요',
    buttonText: '리셀 보기',
    backgroundImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1440&h=500&fit=crop&q=80',
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (_current: number, next: number) => setCurrentSlide(next),
    arrows: false,
    customPaging: () => (
      <div className="w-2 h-2 bg-white/50 rounded-full hover:bg-white transition-colors" />
    ),
    dotsClass: 'slick-dots !bottom-8',
  };

  return (
    <div className="relative h-[500px] mt-16">
      <Slider ref={sliderRef} {...settings}>
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-[500px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.backgroundImage})`,
              }}
            >
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-white px-4 max-w-3xl">
                  <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
                  <p className="text-xl mb-8 text-gray-100">{slide.subtitle}</p>
                  <button className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* 좌우 화살표 */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}