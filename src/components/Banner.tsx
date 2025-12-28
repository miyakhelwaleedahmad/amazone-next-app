'use client';
import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import slider_1 from './sliders/slider_1.jpg';
import slider_2 from './sliders/slider_2.jpg';
import slider_3 from './sliders/slider_3.jpg';
import slider_4 from './sliders/slider_4.jpg';
import slider_5 from './sliders/slider_5.jpg';


const Banner=()=>{
        return(
                <div className='relative'>
                     <Carousel autoPlay infiniteLoop showStatus={false} showIndicators={false} showThumbs={false}interval={3000}>
                <div>
                  <img src={slider_1.src} alt='slider image' />

                     
                </div>
                <div>
                    <img src={slider_2.src } alt="slider image" />
                   
                </div>
                <div>
                    <img src={slider_3.src} alt="slider image" />
                  
                </div>
                  <div>
                    <img src={slider_4.src} alt="slider image" />
                  
                </div> 
                 <div>
                    <img src={slider_5.src} alt="slider image" />
                  
                </div>
                <div className='w-full  h-40 bg-gradient-to-t from-gray-100 to-transparent absolute bottom-0 z-30'></div>
            </Carousel>
                </div>
        )
}
export default Banner;