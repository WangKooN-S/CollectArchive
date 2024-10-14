import React, { useState, useEffect } from 'react';
import './sublayer.css';

const SubLayer = ({theme, isShow, slideTo}) => {
    const [isVisible, setIsVisible] = useState(isShow);
    const [content, setContent] = useState('');
    const [contentClass, setContentClass] = useState('');
    const [lastSlideTo, setLastSlideTo] = useState(null);

    useEffect(() => {
        if (slideTo !== lastSlideTo) {
            setIsVisible(isShow);
            setLastSlideTo(slideTo);
        }
    }, [isShow, slideTo, lastSlideTo]);

    const handleCloseClick = () => {
        setIsVisible(false);
    };

    const handleLiClick = async (event, src, type) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/${src}`);
            let data = await response.text();

            // 파싱하여 img 태그의 src 경로를 require로 변경
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const images = doc.querySelectorAll('img');
            images.forEach(img => {
                const imgSrc = img.getAttribute('src');
                if (imgSrc.indexOf('img-source') > -1) {
                    img.setAttribute('src', require(`../${imgSrc}`));
                }
            });
            data = doc.documentElement.outerHTML;

            setContent(data);
            setContentClass(type);
        } catch (error) {
            console.error('Error fetching the file:', error);
        }
    };

    // theme.id에서 "0"을 제거한 클래스 이름 생성
    const themeClass = theme.id.replace(/0/g, '');
    
    return (
        <div id="subLayer" className={`lay-detail ${isVisible ? 'is-show' : ''} ${themeClass}`}>
            <header id="subHeader" className="lay-detail__head">
                <div className="lay-detail__head-title">
                    <div className="lay-detail__text-theme">KOONIE {theme.id}</div>
                    <h4 className="lay-detail__title">
                        <span className="lay-detail__title--en" style={{ color: theme.color, borderColor: theme.color }}>{theme.nmEn}</span>
                        <span className="lay-detail__title--ko">{theme.nmKo}</span>
                    </h4>
                </div>

                {/* 하위 메뉴 */}
                {theme.menu && (
                    <ul className="sub_menu">
                        {theme.menu.map((menu, index) => {
                            console.log(menu,index)
                            const type = (menu.type === 'list') ? 'btn--list' : '';
                            return(
                                <li key={index} className={type}>
                                    <a href={`/#${menu.hash}`} onClick={(event) => handleLiClick(event, menu.src, menu.type)}>{menu.title}</a>
                                </li>
                            )
                        }
                    )}
                    </ul>
                )}
                <button className="lay-detail__btn-close" onClick={handleCloseClick}>레이어 닫기</button>
            </header>
            <div id="subCont" className="lay-detail__cont">
                <div className={`lay-detail__inner type${contentClass}`} dangerouslySetInnerHTML={{ __html: content }}></div>
            </div>
        </div>
    );
};

export default SubLayer;