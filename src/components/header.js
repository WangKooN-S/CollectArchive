import React, { useState, useEffect, useRef } from 'react';
import './header.css';
import wcoinImage from '../images/ico_wcoin_reverse.png';

const Header = ({ themeData }) => {
    const [isActive, setIsActive] = useState(false);
	const navRef = useRef(null);
    const navListRef = useRef(null);

    // menu-trigger 클릭 이벤트
    const handleMenuClick = () => {
        setIsActive(!isActive);
    };

	useEffect(() => {
        if (navRef.current && navListRef.current) {
            if (isActive) {
                const navListHeight = navListRef.current.offsetHeight;
                navRef.current.style.height = `${navListHeight}px`;
            } else {
                navRef.current.style.height = '0';
            }
        }
    }, [isActive]);

	// 스와이퍼 슬라이동 및 서브 메뉴 이동
	const navigateToMenu = (themeIndex, menuIndex) => {
        setTimeout(() => {
            // .swiper-slide의 themeIndex+1번째 요소 클릭이벤트 실행
            const slide = document.querySelectorAll('.swiper-slide')[themeIndex + 1];
            if (slide) {
                slide.click();
                setTimeout(() => {
                    // .sub_menu의 .menuIndex번째 li의 a 클릭이벤트 실행
                    const li = document.querySelectorAll('.sub_menu li')[menuIndex].querySelector('a');
                    if (li) {
                        li.click();
                    }
                }, 1);
            }
        }, 1);
    };

	// 해시 변경 시 이벤트
	const handleHashChange = () => {
        const hash = window.location.hash.substring(1); // 해시 값에서 '#' 제거
        if (hash) {
            themeData.forEach((theme, themeIndex) => {
                theme.menu.forEach((menu, menuIndex) => {
                    if (menu.hash === hash) {
                        // 해당 테마와 메뉴를 찾았을 때의 로직
                        // console.log(`Theme Index: ${themeIndex}, Menu Index: ${menuIndex}`);
						// .collect-intro__btn-enter 클릭이벤트 실행						
						const introButton = document.querySelector('.collect-intro__btn-enter');
                        if (introButton) {
                            introButton.click();
                            navigateToMenu(themeIndex, menuIndex);
                        } else {
                            setIsActive(false);
                            navigateToMenu(themeIndex, menuIndex);
                        }
                    }
                });
            });
        }
    };

    useEffect(() => {
        // popstate 이벤트 리스너 추가
        window.addEventListener('hashchange', handleHashChange);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [themeData]);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 현재 해시 값을 확인하고 handlePopState 호출
        handleHashChange();
    }, [themeData]);

	// 링크 클릭 시 해시 변경
	const handleLinkClick = (event) => {
        event.preventDefault();
        const targetHash = event.currentTarget.getAttribute('href');
        window.location.hash = targetHash;
        // hashchange 이벤트 수동 트리거
        handleHashChange();
    };

	const makeNavList = () => {
		if (!themeData) return null;
		const navList = themeData.map((theme, index) => {
			return (
				<li key={index} className="collect-nav__section" style={{ '--var-main-color': theme.color }}>
					<header className="collect-nav__head">
						<h2 className="collect-nav__title">{theme.nmEn}</h2>
					</header>
					{theme.menu.map((menu, index) => {
						return (
							<a key={index} href={`#${menu.hash}`} className="collect-nav__link" onClick={handleLinkClick}>{menu.title}</a>
						);
					})}
				</li>
			);
		}
		);
		return navList;
	}

    return (
        <header id="header" className="collect-header">
            <h1 className="collect-header__title">KOONIE <span className="color--yellow">COLLECTION</span></h1>
            <a href="//csd.cafe24.com/myHome_v3" target="_blank" className="collect-header__link--home" rel="noopener noreferrer">
                <img src={wcoinImage} alt="왕쿤홈" />
            </a>
            <button className={`menu-trigger ${isActive ? 'is-active' : ''}`} onClick={handleMenuClick}>
                <span></span>
                <span></span>
                <span></span>
            </button>
			<nav ref={navRef} className="collect-nav">
				<ul ref={navListRef} className="collect-nav__list">
					{makeNavList()}					
				</ul>
			</nav>
        </header>
    );
};

export default Header;