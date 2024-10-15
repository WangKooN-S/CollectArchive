import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import themeData from '../data/theme.json'; // 테마 JSON
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import mainBackground from '../images/bg_slide_main_blk.png';
import SubLayer from './subLayer';

const MainContent = ({ handleHeader }) => {
    const [themes, setThemes] = useState([]);
    const [showSwiper, setShowSwiper] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isSubLayerVisible, setIsSubLayerVisible] = useState(false);    
    const swiperRef = useRef(null);

    useEffect(() => {
        // JSON 데이터를 상태에 설정
        setThemes(themeData);
    }, []);

    // 입장버튼 클릭 이벤트
    const introButtonEvent = () => {
        // 헤더 활성화        
        handleHeader(true);
        // 스와이퍼 초기화
        setShowSwiper(true);     
    };

    // 슬라이드 클릭 이벤트
    const handleSlideClick = (index) => {        
        if (swiperRef.current) {
            if (swiperRef.current.activeIndex === index) {
                handleHeader(false);
                setIsSubLayerVisible(true);
            } else {
                swiperRef.current.slideTo(index);
                setActiveIndex(index);
                setIsSubLayerVisible(false);
            }
        }
    };

    // 서브 레이어 렌더링
    const renderSubLayer = (theme) => {
        return (
            <SubLayer theme={theme} isShow={isSubLayerVisible} onClose={() => {setIsSubLayerVisible(false);handleHeader(true)}}/>
        );
    };
    
    return (
    <>
        <section id="contents" className="collect-content" role="region" aria-labelledby="intro-heading">
            <div id="main" className="collect-main">
                {!showSwiper ? (
                    <div id="intro" className="collect-intro card standard">
                        <h2 id="intro-heading" className="collect-intro__text">
                        <span className="collect-intro__text--ko">수집덕후의 테마가 있는 수집이야기</span>
                        <span className="collect-intro__title">KOONIE</span>
                        <span className="collect-intro__title color--yellow">COLLECTION</span>
                        <span className="collect-intro__icon" aria-hidden="true"></span>
                        </h2><br/>
                        <button className="collect-intro__btn-enter" aria-label="입장하기" onClick={introButtonEvent}>입장하기</button>
                        <span className="bg_area" aria-hidden="true"></span>
                    </div>
                ) : (
                    <>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            speed = {400}
                            spaceBetween={30}
                            slidesPerView={1}
                            pagination={{ el: '.swiper-pagination', clickable: true }}
                            navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
                            onSlideChange={(swiper) => {
                                setActiveIndex(swiper.activeIndex);
                                setIsSubLayerVisible(false);
                            }}
                            onSwiper={(swiper) => {
                                swiperRef.current = swiper;
                                setActiveIndex(swiper.activeIndex);
                            }}
                        >
                            <SwiperSlide id="intro" className="collect-intro card sub_use">
                                <h2 id="intro-heading" className="collect-intro__text">
                                    <span className="collect-intro__text--ko">수집덕후의 테마가 있는 수집이야기</span>
                                    <span className="collect-intro__title">KOONIE</span>
                                    <span className="collect-intro__title color--yellow">COLLECTION</span>
                                    <span className="collect-intro__icon" aria-hidden="true"></span>
                                </h2><br/>
                                <div className="collect-intro__notice">옆으로 넘겨 테마를 선택해 주세요.</div>                            
                                <span className="bg_area" aria-hidden="true" style={{ backgroundImage: `url(${mainBackground})` }}></span>
                            </SwiperSlide>

                            {themes.map((theme,index) => {
                                // console.log(theme);
                                // 배경 이미지 가져옴
                                const imgSrc = require(`../images/${theme.imgBg}`);
                                return (
                                <SwiperSlide className="card sub_use card-theme" key={theme.id} onClick={() => handleSlideClick(index + 1)}>
                                    <div className="collect-card__top">
                                        <div className="collect-card__img-theme">{theme.id}</div>                                                                            
                                        <h3>
                                            <div className="collect-card__title title--en" style={{ color: theme.color }}>{theme.nmEn}</div>
                                            <div className="collect-card__title title--ko">{theme.nmKo}</div>
                                        </h3>
                                    </div>
                                    <div className="collect-card__bottom">수집덕후의 테마가 있는 수집이야기 - KOONIE COLLECTION</div>
                                    <span className="bg_area" aria-hidden="true" style={{ backgroundImage: `url(${imgSrc})` }}></span>
                                </SwiperSlide>
                                )
                            })}                    
                        </Swiper>                       
                        <div className='swiper-button-prev'></div>
                        <div className='swiper-button-next'></div>
                    </>
                )}
            </div>        
        </section>
        <div className="swiper-pagination"></div>

        {isSubLayerVisible && activeIndex !== null && activeIndex !== 0 && ReactDOM.createPortal(
            renderSubLayer(themes[activeIndex-1]),
            document.getElementById('root')
        )}
    </> 
    );
};

export default MainContent;