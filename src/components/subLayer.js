import React, { useState } from 'react';
import './sublayer.css';

const SubLayer = ({theme, isShow}) => {
    const [isVisible, setIsVisible] = useState(isShow);

    const handleCloseClick = () => {
        setIsVisible(false);
    };
    
    // console.log(theme,isShow);

    return (
        <div id="subLayer" className={`lay-detail ${isVisible ? 'is-show' : ''}`}>
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
                            return(
                                <li key={index}>
                                    <a href={`/#${menu.hash}`}>{menu.title}</a>
                                </li>
                            )
                        }
                    )}
                    </ul>
                )}

                {/* <ul class="sub_menu"><li style="color: rgb(255, 193, 7); opacity: 1; font-weight: bold;"><a href="#">수집의 시작</a></li><li><a href="#">화폐/주화의 보존상태 구분</a></li><li><a href="#">지폐의 특이번호 체계</a></li><li><a href="#">화폐 수집 용어</a></li><li><a href="#">관련사이트</a></li></ul> */}
                <button className="lay-detail__btn-close" onClick={handleCloseClick}>레이어 닫기</button>
            </header>
        </div>
    );
};

export default SubLayer;